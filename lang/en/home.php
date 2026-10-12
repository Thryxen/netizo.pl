<?php

/*
 * Server-side copy of the English home page (HomeController). Polish twin: lang/pl/home.php (same keys).
 * Ranges keep together: a word joiner (U+2060) after the dash, a no-break space (U+00A0) after the currency.
 */
return [
    'seo' => [
        'title' => 'Websites and web apps for businesses – Leszno, Poland | Netizo',
        'description' => 'Get a free quote for a website or web app. Speed and SEO as standard, from a team with 150+ projects and 8 years of experience. Based in Leszno, Poland.',
        'share_description' => 'Professional websites and web applications. Modern design, speed, SEO. 150+ projects by our team. Free quote!',
        'organization_description' => 'Netizo builds websites and web applications for businesses in Leszno and across Poland. Founded in 2023 by Damian Idzik and Kamil Nawrot. Modern design, speed and SEO as standard.',
        'country' => 'Poland',
        'image' => 'assets/images/og-netizo-en.png',
    ],

    'faq' => [
        [
            'question' => 'How much does a website or an app cost?',
            'answer' => "A website starts at PLN\u{00A0}799, an online store at PLN\u{00A0}1,299, a web application at PLN\u{00A0}1,699, a mobile app at PLN\u{00A0}999, an AI automation at PLN\u{00A0}299 and DevOps and cloud work at PLN\u{00A0}499. The final price depends on the scope, and you get a detailed quote for free after the brief.",
        ],
        [
            'question' => 'How long does it take to build a website or an app?',
            'answer' => "A simple website or a landing page is usually ready within a week, a larger company website within two weeks, and a web application 2–\u{2060}4\u{00A0}months. We set the exact deadline after the brief, once we know the scope of work.",
        ],
        [
            'question' => 'Will my website show up on Google?',
            'answer' => 'Yes. We build every website with search engines in mind: fast loading, a clean heading structure, titles and descriptions for search results, structured data and a sitemap. No one can honestly guarantee a specific position, because it also depends on the competition and the content, but you get a solid foundation for SEO, local search included.',
        ],
        [
            'question' => 'Can I edit the content of the website myself?',
            'answer' => 'Yes. If you want to do it in-house, we add a simple content management system (CMS): you can change texts, images and posts in it, and we show you how to use it. Bigger changes you send to us as tasks in the client portal.',
        ],
        [
            'question' => 'Will you design the website if I don’t have a design?',
            'answer' => 'Yes. We have UI/UX designers on the team: we design the look from scratch or build on your sketches, logo and brand identity. Before we start coding, you get the design and a clickable Figma prototype to review and approve.',
        ],
        [
            'question' => 'Can you refresh my current website instead of building a new one?',
            'answer' => 'Yes. We start by reviewing your current website: what works, what slows it down and what puts customers off. Then we suggest refreshing the design and content, or a rebuild if the old technology holds you back. When we rebuild, we redirect the old URLs to the new ones to limit the risk of losing Google rankings.',
        ],
        [
            'question' => 'Will you take care of the domain, hosting and business email?',
            'answer' => 'Yes. We help you choose and set up the domain, hosting and business email, or we work with what you already have. Your credentials are kept in an encrypted vault in the client portal, and before a domain or hosting renewal is due, you get a reminder there.',
        ],
        [
            'question' => 'Do you look after the website after launch?',
            'answer' => 'Yes. After launch we stay with you: we take care of hosting, security updates, backups, monitoring and further development of the website. You report fixes as tasks in the client portal, and with ongoing cooperation you get a monthly statement with the hours broken down.',
        ],
        [
            'question' => 'Can I follow the progress while you work?',
            'answer' => 'Yes. From day one you have access to the client portal: you see the tasks and the stage of each one, the time spent and the documents, and you chat with the team. Every two weeks we show the progress on a staging version.',
        ],
        [
            'question' => 'Do you work with companies from all over Poland?',
            'answer' => 'Yes. Most projects run remotely: we talk over video calls and by phone, and you follow the progress in the client portal. With companies in and around Leszno, including Rydzyna, Wschowa, Kościan, Gostyń and Rawicz, we can also meet in person: we come to you. We have no office for clients to visit: Kępno is our registered business address.',
        ],
        [
            'question' => 'What technologies do you use?',
            'answer' => 'We choose technologies to fit the project. Most often we work with this stack: front end – React, Next.js, Vue.js and Tailwind CSS; back end – Node.js, Go, Laravel and Python; databases – PostgreSQL, MongoDB and Redis; cloud – AWS, GCP and Vercel.',
        ],
    ],
];
