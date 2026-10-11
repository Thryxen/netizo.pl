# Gotowość na agentów AI (agent readiness) — https://netizo.pl

Data audytu: 2026-10-11. Zakres: Lighthouse Agentic Browsing, drzewo dostępności (formularze, wizard briefu, dialog oddzwonimy, zakładki kontaktu), robots.txt i Content-Signal, ruch agentów przez Cloudflare, llms.txt, Markdown, ai-catalog.json, `/.well-known`, WebMCP. Nie wysłano żadnego formularza: w sesji przeglądarkowej wszystkie żądania inne niż GET/HEAD były blokowane (`page.route`), zarejestrowano 0 zablokowanych żądań POST. Analityka (GTM, GA4, Clarity) była blokowana po stronie testowej przeglądarki, żeby nie zanieczyszczać danych klienta.

## Podsumowanie

- Lighthouse Agentic Browsing: **2/2 (mobile)** i **2/2 (desktop)**, Lighthouse 13.5.0, HeadlessChrome 156.0.0.0, test 2026-10-11 (strona `/`, język PL). Wynik z lokalnego Lighthouse CLI, bo PSI zwróciło HTTP 429 (dzienny limit zapytań bez klucza API) dla obu strategii.
- Heurystyka Agent-UX (osobna od Lighthouse, 0-100): **100/100**, status `complete`, bez problemów.
- Porażki P0: **0**. P0 niesprawdzone: zachowanie WAF wobec zweryfikowanych botów (patrz sekcja Cloudflare).
- Co najbardziej ogranicza agentów dziś: nie drzewo dostępności (jest czyste), tylko (1) natywne `<input>` kart i chipów w briefie oraz formularzu partnera mają 1 x 1 px (`sr-only`), przez co klik po roli w trybie Playwright przekracza limit czasu, (2) link zgody na politykę prywatności (`/polityka-prywatnosci`) prowadzi do 404, (3) brak jakiejkolwiek warstwy discovery dla agentów (llms.txt, Markdown, WebMCP), co jest szansą, nie wadą.

## Lighthouse Agentic Browsing

Źródło: `npx lighthouse@13.5.0 https://netizo.pl --only-categories=agentic-browsing --output=json` (mobile domyślnie, desktop z `--preset=desktop`), Chrome for Testing 156.0.8078.4, przetworzone przez `lighthouse_agentic.py --from-json`. Surowe pliki: `raw/agentic/lighthouse-agentic-mobile.json`, `raw/agentic/lighthouse-agentic-desktop.json`. Próba przez PSI: `raw/agentic/psi-error.json` (HTTP 429, Queries per day). Lighthouse zmierzył tylko stronę główną PL; `/partnerzy`, `/en`, `/en/partners` sprawdzone osobno heurystykami Playwright (niżej), nie frakcją Lighthouse.

| Audyt | Mobile | Desktop | Liczy się do N |
|---|---|---|---|
| `agent-accessibility-tree` | pass (wszystkie 33 reguły axe) | pass | tak |
| `cumulative-layout-shift` | pass (CLS 0) | pass (CLS 0) | tak |
| `llms-txt` | N/A (`/llms.txt` = 404) | N/A | nie |
| `ard-schema` | N/A (brak `ai-catalog.json`) | N/A | nie |
| `webmcp-form-coverage` | N/A | N/A | nie |
| `webmcp-registered-tools` | N/A (zawsze informacyjny) | N/A | nie |
| `webmcp-schema-validity` | N/A | N/A | nie |

Ograniczenie interpretacji: audyty WebMCP są N/A, bo strona nie rejestruje narzędzi (statycznie: 0 wywołań `registerTool`), a lokalny headless Chrome mógł nie mieć włączonego WebMCP; nie da się tego rozdzielić z tego przebiegu, a oba przypadki dają N/A. To nie jest defekt (zob. `references/webmcp.md`).

Ścieżki, które dodałyby zliczany audyt (opcje, nie cele; wyższe N nie oznacza lepszej strony):

1. `llms.txt` (H1, co najmniej jeden link Markdown, 50+ znaków) dodaje 1 zliczany audyt, czyli 3/3 przy poprawnym pliku.
2. Imperatywne narzędzia WebMCP dodają `webmcp-schema-validity`. Adnotacje deklaratywne (`toolname`/`tooldescription`) dodają `webmcp-form-coverage` dopiero, gdy każdy formularz na stronie je ma, w tym 3 formularze baneru cookies (`/cookie-consent/*`); częściowe adnotowanie zamienia schema-validity w zliczany audyt, który przy brakującym opisie parametru daje 0,5 (porażka). Adnotować w całości albo wcale.
3. `ai-catalog.json` dodaje `ard-schema`, ale tylko ma sens, gdy istnieją zasoby agentowe do wylistowania (serwer MCP, karta A2A, skille). Netizo ich nie ma, więc nie rekomenduję.

## Heurystyka Agent-UX (osobno, nie jest frakcją Lighthouse)

`agent_ux_check.py https://netizo.pl --json`: score 100, `score_status: complete`, `partial: false`. 36 prawdziwych `<button>`, 48 `<a href>`, 0 widgetów `div onclick`, 23 landmarki semantyczne, drzewo 1922 węzłów, 72 interaktywne (27 button, 34 link), `unnamed_interactive: 0`, `inputs_without_label: 0`. Uwaga: `inputs_without_aria: 15` to licznik heurystyki (pola bez ARIA, ale z natywną etykietą `<label for>`), nie błąd.

## Znaleziska według priorytetu

Skala ważności: Critical/High/Medium/Low/Info; w nawiasie priorytet P0-P3 z tabeli skilla `seo-agentic`, jeśli istnieje odpowiednik.

### High

**H1. Zgoda w briefie wskazuje stronę, która zwraca 404 (agent nie może przeczytać regulaminu, który ma zaakceptować w imieniu użytkownika)** (poza tabelą P0-P3; na styku z audytem prawnym/technicznym)

- Dowód: krok 6 briefu ma wymagany checkbox `brief-privacy` (`aria-required="true"`), etykieta: "Akceptuję politykę prywatności i wyrażam zgodę na kontakt w sprawie zapytania." Link w etykiecie: `href="/polityka-prywatnosci"` (otwiera się w nowej karcie). `GET /polityka-prywatnosci` = 404 (`raw/checks.txt`); stopka na każdej stronie linkuje też `/utrzymanie` i `/regulamin` (404 według briefu). W AX: `link "politykę prywatności"` z `/url: /polityka-prywatnosci`. Na `/en` stopka oznacza je `hrefLang="pl"` ("Privacy policy (in Polish)"), ale cel nadal nie istnieje.
- Skutek dla agentów: agent działający w imieniu człowieka ma zaznaczyć zgodę na dokument, do którego nie ma dostępu; dobrze zaprojektowany agent zatrzyma się i zapyta użytkownika albo odmówi wysłania briefu. Formularz zbiera dane osobowe (imię, e-mail, telefon).
- Fix: opublikować strony `/polityka-prywatnosci`, `/regulamin`, `/utrzymanie` (lub zdjąć linki do czasu publikacji). Pliki: `resources/js/components/home/brief/brief-steps.tsx:378`, `resources/js/lib/site.ts:63-65` (PL) i `:69-71` (EN). Weryfikacja: `curl -sI https://netizo.pl/polityka-prywatnosci` = 200 i powtórzenie `agent_ux_check.py`.

### Medium

**M1. Natywne inputy kart i chipów mają 1 x 1 px (`sr-only`), więc klik po roli `checkbox`/`radio` w trybie Playwright się nie udaje** (P1, "stabilne, widoczne cele interakcji"; checklista `agent-friendly-pages.md` pkt 3 i 4)

- Dowód (zmierzone w Chromium, bez wysyłania): `input#brief-types-website` ma `getBoundingClientRect` = 1 x 1 px, a jego `<label>` 240 x 128 px. `elementFromPoint` w środku inputa zwraca `svg` (ikona karty), nie input. Playwright `get_by_role("checkbox", name="Strona WWW").check()` kończy się `Timeout`, log: "`<svg ... lucide-globe> intercepts pointer events`"; to samo dla `click`, `check(trial=True)` oraz dla `radio` w formularzu partnera (`input#partner-type-accounting`, `w=1`). Natomiast klik w tekst etykiety ("Landing page, firmowa, portfolio") zaznacza checkbox, a `Space` na sfokusowanym inpucie też działa. Dotyczy: 6 kart w kroku 1, radio w krokach 3 i 5, chipów w krokach 2, 4, 6 oraz 6 radio typu partnera (6 inputów `sr-only` na każdej z 4 stron przy pierwszym widoku).
- Skutek: agenty sterujące przez Playwright (aktualizacja przez referencje z drzewa, z kontrolą "element odbiera zdarzenia wskaźnika") utkną na pierwszym kroku wizarda; agenty klikające współrzędnymi lub etykietą (zrzuty ekranu, CDP) przejdą, bo trafiają w `svg`/`label` wewnątrz etykiety. Nie testowałem konkretnych agentów konsumenckich.
- Fix: rozciągnąć natywny input na całą kartę zamiast chować go do 1 px, treść etykiety zostawić pod spodem: w `HiddenInput` zamienić `className="sr-only"` na `absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0` (etykieta ma już `relative`, a fokus jest rysowany przez `has-[:focus-visible]` na etykiecie, więc ring zostaje). Plik: `resources/js/components/home/brief/choices.tsx:44-58` (klasa w linii 55); używają go `ChoiceCard` (`:67-87`) i `ChoiceChip` (`:97-114`). Weryfikacja: `locator.check()` na roli `checkbox` przechodzi bez `force`, `elementFromPoint` w środku karty zwraca input.

### Low

**L1. Stan "wymagane" nie jest widoczny dla agentów w grupach radio/checkbox oraz w atrybutach DOM** (P0/P1 częściowo, `label`/`aria-required`)

- Dowód: pola tekstowe mają `aria-required="true"`, ale formularze są `noValidate` i nie mają atrybutu HTML `required` (`quick_attrs`: `req=false`, `ariaReq=true` dla imienia, e-maila i wiadomości). Grupy wymagane po stronie serwera i klienta (typ projektu w kroku 1: bramka w `brief-wizard.tsx:196-199`; `partner_type` w formularzu partnera) nie mają żadnego sygnału wymagalności: `fieldset#partner-type` bez `aria-required`/roli `radiogroup`, gwiazdka w `<legend>` jest `aria-hidden`, a w drzewie jest tylko `group "Kim jesteś?"`. Agent dowie się o wymaganiu dopiero po nieudanym wysłaniu (wtedy działa dobrze: `aria-invalid`, `aria-describedby` do komunikatu, fokus na pierwszym błędnym polu).
- Fix: dodać natywne `required` obok `aria-required` (przy `noValidate` nie wywoła bąbelków przeglądarki), a dla radio `required` na jednym z inputów grupy lub `role="radiogroup" aria-required="true"` na fieldsecie. Pliki: `resources/js/components/home/quick-contact-form.tsx:190,205,230`, `resources/js/components/home/brief/choices.tsx:128-137` (`ChoiceFieldset`), `resources/js/components/partners/partner-application-form.tsx:218-242`.

**L2. Listy select to Radix `combobox`, nie natywny `<select>`** (Info/Low)

- Dowód: `#contact-subject` to `button role=combobox` z etykietą "Temat"; po kliknięciu pojawia się `listbox` z 4 opcjami (Nowy projekt, Współpraca, Kariera, Inne), każda `role=option`. Pole nie ma `name`, więc agent korzystający z `select_option` nie zadziała, wymagane są dwa kliknięcia. W drzewie jest poprawnie nazwane i obsługiwalne, więc nie jest to błąd Lighthouse.
- Fix (opcjonalny): zostać przy Radix, ale potwierdzić obsługę klawiaturą (Enter/strzałki) w testach przeglądarkowych; natywny `<select>` byłby najbardziej przewidywalny dla agentów. Plik: `resources/js/components/home/brief/fields.tsx:133-150`.

**L3. Cele dotykowe linków w stopce na desktopie mają wysokość 20 px (poniżej 24 CSS px WCAG 2.2 AA)** (checklista pkt 3)

- Dowód: 12-14 linków na stronę przy 1440 px (e-mail, telefon, Panel klienta, Program partnerski, Utrzymanie, Regulamin, Polityka prywatności, profile społecznościowe, przełącznik języka) ma wysokość 20 px; na 390 px wszystkie cele mają co najmniej 44 px (jedyny wyjątek to skip link 34 x 18 px widoczny tylko na fokusie). Checkbox zgody (Radix `button role=checkbox`) ma 16 x 16 px, ale jego etykieta jest celem klikalnym.
- Fix: `min-h-6`/padding na linkach stopki (`resources/js/components/home/site-footer.tsx`), wzorem `contactLinkClass` z `contact-section.tsx:39-40`.

### Info (szanse, nie defekty)

**I1. Brak `llms.txt`** (P1, absencja = info). `GET /llms.txt` = 404 `text/html` (prawdziwy 404, więc audyt jest N/A, nie porażką); `/llms-full.txt` też 404. Dla serwisu o 4 stronach plik byłby krótki: H1 "Netizo", blockquote z opisem (agencja interaktywna, Leszno, cała Polska, usługi: strony WWW, aplikacje webowe, sklepy), linki do `/`, `/partnerzy`, `/en`, `/en/partners`, `sitemap.xml`, kontakt (kontakt@netizo.pl, +48 884 343 924). Wzorzec: `agentic_fix.py llms https://netizo.pl` (wersja robocza na stdout). Plik: nowy `public/llms.txt`. Weryfikacja: Lighthouse `llms-txt` przechodzi w liczniku (3/3). Brak wpływu na Google Search; nie ma publicznego dowodu, że konkretny agent konsumencki czyta ten plik.

**I2. Brak dostarczania Markdown** (P1, absencja = info). `Accept: text/markdown` na `/` i `/partnerzy` zwraca `200 text/html; charset=utf-8`; nagłówki `Vary: Accept-Encoding` i `Vary: X-Inertia` (bez osobnego `Vary: Accept`). Uwaga: `agentic_check.py` raportuje `vary_accept: true`, ale to prawdopodobnie dopasowanie podciągu "Accept" w "Accept-Encoding"; faktyczne nagłówki w `raw/home-pl.headers` nie zawierają `Vary: Accept`. `/index.md`, `/partnerzy.md`, `/en.md` = 404; brak `<link rel="alternate" type="text/markdown">` i brak nagłówka `Link` do wersji Markdown. Opcja: negocjacja `Accept` w Laravelu albo funkcja "Markdown for Agents" na krawędzi Cloudflare (dostępność w planie klienta niezweryfikowana). Nie ma publicznego potwierdzenia, że jakikolwiek agent konsumencki wysyła `Accept: text/markdown`.

**I3. Brak WebMCP** (P2; dla serwisu z formularzami lead-gen opcjonalne wzmocnienie; **szkic W3C Community Group, nie standard**, sprawdzone 2026-09-23). Statycznie: 0 wywołań `registerTool`, 0 odwołań do `document.modelContext`/`navigator.modelContext`; 6 formularzy w HTML strony głównej (newsletter, brief, szybka wiadomość + 3 formularze baneru cookies), 0 z `toolname`/`tooldescription`; formularz "oddzwonimy" jest renderowany dopiero po otwarciu dialogu. Jeśli właściciel chce, kandydaci to narzędzia imperatywne podpięte do tych samych obsług co UI (`useForm().post`): `request_callback(phone)`, `send_quick_message(name, email, subject, message)`, `subscribe_newsletter(email)`, `submit_partner_application(...)`, `submit_project_brief(...)`. Wszystkie wysyłają dane osobowe i leady, więc: `consequentialHint: true` i obowiązkowe potwierdzenie przez człowieka, te same walidacje i limit `throttle:forms`, logowanie wywołań po stronie serwera. WebKit sprzeciwia się, Mozilla jest neutralna, w ChatGPT desktop wołane są tylko narzędzia imperatywne (vendor-matrix, 2026-09-23). Rejestracja z modułu w `resources/js` jest zgodna z CSP (`script-src 'self'`), bez inline.

**I4. Brak `ai-catalog.json` i `/.well-known/*`** (P3; absencja nie jest defektem). `/.well-known/ai-catalog.json`, `agent-card.json`, `api-catalog`, `oauth-protected-resource`, `oauth-authorization-server`, `ucp`, `mcp.json`, `security.txt`, `http-message-signatures-directory` = 404 `text/html`. Nieznane URL-e zwracają prawdziwy 404 (`catch_all_200: false`; sonda `claude-seo-404-probe-*` = 404), więc nie ma soft-404, który mylił by klientów discovery. Netizo nie prowadzi API/MCP/A2A ani sklepu, więc te dokumenty nie mają zastosowania. `ai-catalog.json` (ARD 1.0) to szkic, sprawdzone 2026-09-23. Web Bot Auth: strona nie podpisuje ruchu i nie musi; weryfikacja podpisów leży po stronie Cloudflare.

**I5. Zwinięte odpowiedzi FAQ w drzewie dostępności są puste.** W AX każde pytanie to `heading` + `button`, a odpowiadający mu `region` nie ma dzieci do czasu rozwinięcia (11 pytań). Agent czytający tylko drzewo widzi pytania; odpowiedzi poznaje po rozwinięciu przyciskiem (to działa) lub z JSON-LD `FAQPage` (według CLAUDE.md zbudowany z tych samych treści). Nie weryfikowałem, czy odpowiedzi są obecne w SSR HTML jako ukryty tekst. Nie wymaga zmian.

**I6. Baner cookies** (zachowanie sprawdzone tylko przed wyborem zgody). Dolny pasek `<aside>` (bez nazwy) z `h2` "Korzystamy z plików cookie" i przyciskami "Tylko niezbędne", "Zaakceptuj wszystko", link "Dostosuj"; nie jest modalem, nie przechwytuje fokusu, zajmuje około 135 px u dołu widoku desktop, a w drzewie leży na końcu. Trzy formularze baneru (`/cookie-consent/accept-essentials|accept-all|configure`, POST) bez nazw: nie są w drzewie przeszkodą, ale liczą się do `webmcp-form-coverage` (patrz ścieżka 2). Nie testowałem stanu po zgodzie.

## Co działa dobrze (zmierzone)

- Drzewo dostępności: 0 nienazwanych elementów interaktywnych na 4 stronach i dwóch viewportach (desktop 1440, mobile 390): 76 (strona główna), 56 (partnerzy) elementów interaktywnych, wersje PL i EN; Lighthouse `agent-accessibility-tree` pass.
- Formularze (newsletter, szybka wiadomość, brief, oddzwonimy, partnerzy): każde pole ma `<label for>` (lub sr-only label w newsletterze), poprawne `autocomplete` (`name`, `email`, `tel`, `organization`, `organization-title`, `url`), `aria-required`, `aria-invalid` i `aria-describedby` do komunikatu błędu; formularze mają nazwy (`aria-label` lub `aria-labelledby`), przyciski mają nazwy ("Wyślij brief", "Zapisz się", "Wyślij wiadomość", "Wyślij zgłoszenie", "Zadzwońcie do mnie").
- Wizard briefu (6 kroków, przejście bez wysyłania): nagłówek `h3` "Krok N z 6: ..." z fokusem po każdej zmianie kroku (potwierdzone dla kroków 2-6), `progressbar "Postęp briefu"`, przyciski "Dalej", "Wstecz", "Wyślij brief" (tylko w kroku 6); nieudane "Dalej" bez wyboru w kroku 1 daje komunikat "Wybierz przynajmniej jeden typ projektu." i fokus na pierwszej karcie z `aria-invalid`; grupy w `fieldset`/`legend`. 0 elementów bez etykiety w krokach 1-5; w kroku 6 jedyny nieoznaczony element to ukryty natywny `<select>` Radix z `aria-hidden`.
- Dialog "oddzwonimy": `role=dialog` nazwany ("Oddzwonimy do Ciebie") i opisany (`aria-labelledby`/`aria-describedby`), fokus trafia na `input#callback-phone`, tło dostaje `aria-hidden`, `Escape` zamyka, fokus wraca na przycisk wywołujący ("Zadzwońcie do mnie"). Przyciski wywołujące: sekcja kontaktu i pływający przycisk "Zamów rozmowę telefoniczną" (52 x 52 px).
- Zakładki kontaktu: `tablist "Sposób kontaktu"`, `tab` z `aria-selected`, `tabpanel` nazwany przez `aria-labelledby`; oba panele zamontowane, więc brief przeżywa przełączenie na "Szybka wiadomość" (nieaktywny panel `display:none`, poza drzewem).
- Stany potwierdzenia (według kodu, nie wysyłane): trwały `role="status"` zamiast toastu (`quick-contact-form.tsx`, `callback-dialog.tsx`, `newsletter-section.tsx`, `brief-wizard.tsx`, `partner-application-form.tsx`), fokus na nagłówku sukcesu, błąd limitu `throttle:forms` jako widoczny alert (`fields.tsx:152-163`).
- Wyrenderowanie bez JS: 2407 słów w SSR (`server-rendered` pass, brak znacznika powłoki JS); w HTML SSR są 3 formularze aplikacji.
- Layout: CLS 0 (mobile i desktop); nawigacja w `nav`, `main`, `banner`, `contentinfo`, link "Przejdź do treści"; tytuł, `lang` ("pl"/"en") poprawne; menu mobilne to `dialog "Menu"` z przyciskami "Otwórz menu"/"Zamknij menu" (bez menu tylko na hover).
- Kontakt dla agentów jest wprost w drzewie: `mailto:kontakt@netizo.pl`, `tel:+48884343924`.
- robots.txt osiągalny (200), jedna grupa `*` z `Allow: /` i `Sitemap`; prawdziwe 404 dla nieznanych adresów (w tym `/en/nope`, `/nie-istnieje`, `/PARTNERZY`).

## Polityka dostępu (osobne linie: trenowanie, wyszukiwanie, akcje użytkownika)

Źródło: `public/robots.txt` (`User-agent: *`, `Allow: /`, `Sitemap: https://netizo.pl/sitemap.xml`), bez `Content-Signal`, bez nazwanych grup; wszystkie tokeny AI wpadają w grupę `*` (agentic_check: `named_groups: []`). Zasada RFC 9309: skoro nie ma nazwanych grup, żadna nie jest pomijana.

- Trenowanie modeli (GPTBot, ClaudeBot, CCBot; Google-Extended i Applebot-Extended jako tokeny kontrolne): dozwolone domyślnie, przez brak reguł. To nie jest świadoma decyzja zapisana w robots.txt. Czy blokować trenowanie, to decyzja biznesowa właściciela; ten audyt jej nie rekomenduje ani nie wyklucza.
- Wyszukiwanie/indeksy AI (OAI-SearchBot, Claude-SearchBot, PerplexityBot): dozwolone (`Allow: /` w grupie `*`).
- Akcje wywołane przez użytkownika (ChatGPT-User, Claude-User, Perplexity-User, Google-Agent): dozwolone; według dokumentacji dostawców robots.txt "may not apply" (ChatGPT-User), "generally ignores" (Perplexity-User, Google-Agent), honoruje Claude-User, więc robots.txt nie jest tu mechanizmem kontroli. Ścieżka prywatna `/admin` jest chroniona logowaniem (`/admin` → 302 → `/admin/login`), nie robots.txt (zgodnie z zasadą skilla); robots.txt jej nie wymienia, a `noindex` jest w widoku `admin.blade.php` (według CLAUDE.md, nie weryfikowałem odpowiedzi `/admin/login`).
- `Content-Signal` (Cloudflare Content Signals Policy, CC0; wersja IETF expired 2026-04-04; nie ma potwierdzonego wpływu u Google; **szkic/polityka, sprawdzone 2026-09-23**): nieobecny, to info. Jeśli właściciel zdecyduje, że chce zapisać preferencję, linia dołączana do grupy `*` w `public/robots.txt`, np. `Content-Signal: search=yes, ai-input=yes, ai-train=<decyzja właściciela>`. Nie zmieniać `Allow`/`Disallow` przy okazji.

## Cloudflare i ruch agentów

- Zastosowano dane już zebrane w `raw/checks.txt` (nie uruchamiałem `--ua-matrix`; brak wzmianki o zgodzie na testy UA agentów w zleceniu): 8 tokenów UA (Googlebot, GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Bingbot, CCBot, Applebot) dostaje `200` z tym samym rozmiarem (455 004 B), czyli bez wyzwań i bez różnicowania treści; w nagłówkach brak `cf-mitigated`. Nagłówek `server: cloudflare`, `cf-cache-status: DYNAMIC`.
- Ograniczenie: to zachowanie wobec **niezweryfikowanego** ruchu z jednego adresu IP, nie dowód, jak WAF traktuje prawdziwe boty (Cloudflare weryfikuje boty po IP/Web Bot Auth). P0 "WAF przepuszcza zweryfikowane boty i podpisanych agentów" jest więc **niesprawdzony**, nie zaliczony. Potwierdzić w Cloudflare: Security > Events (filtr po `cf.bot_management.verified_bot` i `cf.client.bot`) oraz ustawienia AI Crawl Control / Bot Fight Mode.
- Turnstile jest tylko na logowaniu `/admin` (CSP zezwala na `challenges.cloudflare.com`, ale formularze publiczne nie mają CAPTCHA): dobrze dla agentów (brak CAPTCHA na treści i formularzach). Ochrona formularzy publicznych to wyłącznie `throttle:forms` (10 żądań/min na IP; komunikat widoczny jako alert). Nie sprawdzałem, czy formularze mają honeypot. Jeśli właściciel włączy w Cloudflare Bot Fight Mode lub blokadę botów AI, agenty konsumenckie wywołane przez użytkownika mogłyby dostawać wyzwanie na `/`; wtedy trzeba zrobić allowlistę zweryfikowanych botów, nie list UA.

## Statusy standardów (data sprawdzenia z `references/vendor-matrix.md`: 2026-09-23, 18 dni przed audytem, poniżej progu 60 dni)

- WebMCP: szkic W3C Web Machine Learning Community Group, nie standard; Chrome origin trial M149 do M156 (przewidywany koniec trialu 2026-11-17, źródło wtórne); WebKit sprzeciwia się, Mozilla neutralna.
- Content-Signal: polityka Cloudflare (CC0, start 2025-09-24); szkic IETF `draft-romm-aipref-contentsignals` wygasł 2026-04-04; brak potwierdzonego wpływu.
- ai-catalog.json / Agentic Resource Discovery: szkic specyfikacji ARD 1.0 (sprawdzany przez Lighthouse 13.5 jako `ard-schema`).
- MCP Server Card: SEP-2127 otwarty i niescalony (stan 2026-09-12).
- Web Bot Auth: `draft-ietf-webbotauth-httpsig-protocol-00` (2026-09-01); `Signature-Agent` jako słownik.
- Lighthouse: 13.5.0 (npm latest 2026-09-18); kategoria Agentic Browsing "w rozwoju, podlega zmianom".

## Rekomendacje w kolejności wdrożenia

1. (High) Opublikować `/polityka-prywatnosci`, `/regulamin`, `/utrzymanie` albo zdjąć linki (`brief-steps.tsx:378`, `site.ts:63-71`). Odblokowuje: świadome wysłanie briefu przez agenta/użytkownika. Potwierdzenie: 200 na adresach i brak 404 w teście linków.
2. (Medium) Rozciągnąć natywny input kart/chipów na całą kartę (`choices.tsx:44-58`). Odblokowuje: sterowanie wizardem przez agenty Playwright bez `force`. Potwierdzenie: `get_by_role("checkbox").check()` przechodzi.
3. (Low) Natywne `required` + `aria-required` i sygnał wymagalności grup radio/checkbox (`choices.tsx:128-137`, `partner-application-form.tsx:218-242`, `quick-contact-form.tsx:190,205,230`). Potwierdzenie: `agent_ux_check.py` bez regresji, wymagalność widoczna w drzewie.
4. (Low) Cele linków stopki co najmniej 24 px na desktopie (`site-footer.tsx`).
5. (Opcjonalnie, szansa) `public/llms.txt` (+1 zliczany audyt Lighthouse); decyzja właściciela o `Content-Signal` i polityce treningowej; Markdown przez negocjację `Accept` z `Vary: Accept` (jeśli właściciel chce); WebMCP imperatywny dla 5 formularzy z potwierdzeniem człowieka. Żadna z tych pozycji nie obiecuje wzrostu rankingu, cytowań ani ruchu.
6. (Weryfikacja) Sprawdzić w logach Cloudflare, jak traktowane są zweryfikowane boty AI (P0 niesprawdzone), i ponowić Lighthouse po naprawach (PSI z kluczem API, `/seo google setup`, albo lokalnie jak wyżej).

## Dowody (pliki)

- `raw/agentic/home-pl.aria.yml`, `partners-pl.aria.yml`, `newsletter.aria.yml`, `quick-contact.aria.yml`, `quick-contact-en.aria.yml`, `callback-dialog.aria.yml`, `brief-step1.aria.yml` do `brief-step6.aria.yml`, `brief-step1-error.aria.yml`, `partner-form.aria.yml`, `mobile-header.aria.yml`, `mobile-menu.aria.yml`.
- `raw/agentic/recon2.json`, `recon4.json`, `recon5.json`, `recon6.json` (pomiary DOM/AX, rozmiary celów, błędy `check()`), `lighthouse-agentic-mobile.json`, `lighthouse-agentic-desktop.json`, `agentic-check.json`, `agent-ux.json`, `psi-error.json`.
- Zrzuty: `screenshots/agentic-home-desktop.png`, `agentic-home-mobile.png`, `agentic-brief-step1.png`, `agentic-brief-step5.png`, `agentic-brief-step6.png`, `agentic-quick-contact.png`, `agentic-callback-dialog.png`, `agentic-partners-form.png`, `agentic-mobile-menu.png`.

## Dane strukturalne dla `audit-data.json` (kategoria: AI Search Readiness)

```json
{
  "category": "AI Search Readiness",
  "subcategory": "Agent readiness",
  "score": 78,
  "metrics": {
    "lighthouse_agentic": {"mobile": "2/2", "desktop": "2/2", "version": "13.5.0", "chrome": "HeadlessChrome/156.0.0.0", "date": "2026-10-11", "source": "local CLI (PSI HTTP 429)"},
    "agent_ux_heuristic": {"score": 100, "status": "complete"}
  },
  "findings": [
    {"title": "Link zgody w briefie prowadzi do 404 (/polityka-prywatnosci)", "severity": "high", "description": "Checkbox zgody w kroku 6 briefu linkuje do /polityka-prywatnosci, ktora zwraca 404; stopka linkuje tez /utrzymanie i /regulamin (404). Agent nie moze przeczytac dokumentu, ktory ma zaakceptowac w imieniu uzytkownika.", "recommendation": "Opublikowac strony lub zdjac linki: resources/js/components/home/brief/brief-steps.tsx:378, resources/js/lib/site.ts:63-71."},
    {"title": "Natywne inputy kart i chipow maja 1x1 px (sr-only)", "severity": "medium", "description": "Playwright check()/click() na roli checkbox/radio konczy sie timeoutem (svg intercepts pointer events); klik w etykiete i Space dzialaja. Dotyczy wizarda briefu i radio typu partnera.", "recommendation": "W HiddenInput (resources/js/components/home/brief/choices.tsx:44-58) zamienic sr-only na absolute inset-0 size-full opacity-0 cursor-pointer."},
    {"title": "Wymagalnosc grup radio/checkbox i atrybut required nie sa widoczne dla agentow", "severity": "low", "description": "Formularze maja noValidate i tylko aria-required na polach tekstowych; grupy (typ projektu, partner_type) nie sygnalizuja wymagalnosci; gwiazdka w legend jest aria-hidden.", "recommendation": "Dodac natywne required i aria-required na grupach: choices.tsx:128-137, partner-application-form.tsx:218-242, quick-contact-form.tsx:190,205,230."},
    {"title": "Cele linkow w stopce 20 px na desktopie", "severity": "low", "description": "12-14 linkow na strone ma wysokosc 20 px (<24 px WCAG 2.2 AA); na mobile cele maja >=44 px.", "recommendation": "min-h-6 lub padding w resources/js/components/home/site-footer.tsx."},
    {"title": "Brak llms.txt, Markdown, WebMCP i ai-catalog.json (szanse)", "severity": "info", "description": "llms.txt 404 (Lighthouse N/A), Accept: text/markdown zwraca text/html, brak registerTool i adnotacji formularzy, brak ai-catalog.json. Lighthouse 2/2; llms.txt dodalby zliczany audyt (3/3). WebMCP i ai-catalog to szkice (sprawdzone 2026-09-23).", "recommendation": "Opcjonalnie: public/llms.txt, negocjacja Accept z Vary: Accept, imperatywne narzedzia WebMCP z potwierdzeniem czlowieka dla 5 formularzy; ai-catalog.json nie jest potrzebny."},
    {"title": "Brak zapisanej polityki AI w robots.txt (Content-Signal)", "severity": "info", "description": "robots.txt ma tylko grupe * z Allow: /; trenowanie, wyszukiwanie i akcje uzytkownika sa dozwolone domyslnie, bez Content-Signal (polityka Cloudflare, szkic IETF wygasl 2026-04-04).", "recommendation": "Decyzja wlasciciela o polityce treningowej; ewentualnie linia Content-Signal w public/robots.txt."},
    {"title": "Zachowanie Cloudflare wobec zweryfikowanych botow niesprawdzone", "severity": "info", "description": "8 tokenow UA dostaje 200 (niezweryfikowany ruch z jednego IP); Turnstile tylko na /admin; formularze publiczne chronione tylko throttle:forms.", "recommendation": "Sprawdzic Security Events i AI Crawl Control w Cloudflare; przy blokadzie botow AI zrobic allowliste zweryfikowanych botow."}
  ]
}
```

## Ocena kategorii

**78/100** — wszystkie pomiary P0 przechodzą (Lighthouse 2/2 na mobile i desktop, Agent-UX 100, SSR bez JS, 0 nienazwanych kontrolek, CLS 0, brak CAPTCHA na treści), a punkty odejmują: link zgody w briefie do 404 (High), 1-pikselowe inputy kart blokujące sterowanie wizardem przez Playwright (Medium), niewidoczna wymagalność grup oraz brak jakiejkolwiek warstwy discovery dla agentów i niesprawdzone traktowanie zweryfikowanych botów przez Cloudflare.
