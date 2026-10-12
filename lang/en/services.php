<?php

/*
 * Server-side copy of the English service pages (ServicePageController): meta tags, the card shown on the other service
 * pages and in llms.txt, the tiers and the FAQ. The tiers' prices come from App\Enums\Service::priceBrackets(), in the
 * order of `offers`. Polish twin: lang/pl/services.php (same keys).
 * Ranges keep together: a word joiner (U+2060) after the dash, a no-break space (U+00A0) before the unit and after "PLN".
 * Titles and descriptions for search results use plain spaces.
 */
return [
    'websites' => [
        'seo' => [
            'title' => 'Website development from PLN 799 – Leszno, Poland | Netizo',
            'description' => 'Order a business website from PLN 799. Figma design, mobile version, SEO and speed as standard. A simple website usually within a week. Free quote.',
            'name' => 'Website development',
            'breadcrumb' => 'Websites',
            'image' => 'assets/images/og-netizo-websites-en.jpg',
            'image_alt' => 'Website development from PLN 799 – Netizo',
        ],

        'card' => [
            'name' => 'Websites',
            'description' => 'Company websites and landing pages with a Figma design, SEO and speed as standard.',
        ],

        'offers' => [
            [
                'name' => 'Simple website',
                'description' => 'A landing page or a business card website: one page or a few that present your company and collect inquiries.',
                'timeline' => 'Usually up to a week',
                'includes' => [
                    'Visual design and a clickable prototype in Figma',
                    'A version for phones, tablets and desktops',
                    'A contact form with email notifications',
                    'Fast loading and SEO basics: titles, descriptions, structured data and a sitemap',
                    'Help with your domain, hosting and business email',
                ],
            ],
            [
                'name' => 'Larger website',
                'description' => 'A company website with many pages and content you edit yourself: your offer, a blog, a gallery or bookings.',
                'timeline' => 'Usually up to two weeks',
                'includes' => [
                    'Everything in the simple website',
                    'A content management system (CMS) and a walkthrough of how to use it',
                    'A blog, news or a catalog of your offer',
                    'Language versions, if you need them',
                    'Integrations such as online booking, payments or a CRM',
                    'Redirects from old addresses when we rebuild your site',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'How much does a business website cost?',
                'answer' => "A simple website, such as a landing page or a business card site, costs PLN\u{00A0}799 to PLN\u{00A0}1,499, and a larger website with a CMS, a blog or bookings PLN\u{00A0}1,799 to PLN\u{00A0}2,999. The price goes up mainly with the number of pages, integrations and features that have to be designed from scratch. You get a detailed quote for free after the brief.",
            ],
            [
                'question' => 'How long does it take to build a website?',
                'answer' => 'A simple website or a landing page is usually ready within a week, and a larger company website within two weeks. Content and photos affect the timeline most often, so we agree on them at the very start. We give you the exact timeline after the brief, together with the quote.',
            ],
            [
                'question' => 'What do I need to prepare before we start?',
                'answer' => 'It’s enough to tell us about your company and the customers you want to reach. A logo, photos, examples of websites you like and access to your current domain all help. If you don’t have the copy yet, we’ll help you plan it for every page.',
            ],
            [
                'question' => 'What do you build websites with: WordPress or custom code?',
                'answer' => 'We choose the technology for the website. We usually build company websites and landing pages with Next.js, Astro or Laravel with React, and you edit the content in a simple CMS. That way the site loads fast and doesn’t depend on plugins that need constant updates. If you need a specific system, mention it in the brief.',
            ],
            [
                'question' => 'Will the website look good on phones?',
                'answer' => 'Yes. We design every website for phones first, then scale it up to tablets and desktops. You see both versions in the Figma prototype before we start coding, and we test the site on real devices before it goes live.',
            ],
            [
                'question' => 'Will you help the website rank in Google?',
                'answer' => 'We build every website with search engines in mind: fast loading, a proper heading structure, titles and descriptions for search results, structured data and a sitemap. No one can honestly guarantee a specific ranking, because it also depends on the competition and the content, but you get a solid foundation for SEO, local SEO included. When we rebuild a site, we redirect old addresses to the new ones.',
            ],
            [
                'question' => 'What happens after the website goes live?',
                'answer' => 'We show you how to edit the content in the CMS, if you have one, and you report bigger changes as tasks in the client portal. We can also stay with you long term: we take care of hosting, security updates, backups and monitoring, and every month you get a statement with the hours itemized.',
            ],
        ],
    ],

    'stores' => [
        'seo' => [
            'title' => 'Online store development from PLN 1,299 | Netizo',
            'description' => 'Order an online store from PLN 1,299. Online payments, shipping, inventory or ERP integration and fast product pages. Free quote after your brief.',
            'name' => 'Online store development',
            'breadcrumb' => 'Online stores',
            'image' => 'assets/images/og-netizo-online-stores-en.jpg',
            'image_alt' => 'Online store development from PLN 1,299 – Netizo',
        ],

        'card' => [
            'name' => 'Online stores',
            'description' => 'Stores with online payments, shipping and inventory integration, from a small shop to B2B.',
        ],

        'offers' => [
            [
                'name' => 'Small store',
                'description' => 'A store for a company that’s starting to sell online: a product catalog, a cart, payments, shipping and a panel for handling orders.',
                'includes' => [
                    'Store design and a clickable prototype in Figma',
                    'A product catalog with variants such as size or color',
                    'Online payments: BLIK, cards and instant bank transfers',
                    'Courier and parcel locker shipping, with the cost calculated in the cart',
                    'A panel for orders, stock levels and discount codes',
                    'Fast product pages and SEO basics',
                ],
            ],
            [
                'name' => 'Large e-commerce',
                'description' => 'A store with a large catalog or B2B sales, connected to your warehouse, wholesaler or ERP system, with individual prices.',
                'includes' => [
                    'Everything in the small store',
                    'Integration with your warehouse, wholesaler or ERP, such as Comarch ERP Optima',
                    'Individual price lists, credit limits and business accounts (B2B)',
                    'Search with filters and suggestions',
                    'A fast headless frontend, for example in Next.js',
                    'Moving products and customers over from your old store',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'How much does an online store cost?',
                'answer' => "A small store starts at PLN\u{00A0}1,299 and usually stays under PLN\u{00A0}15,000, and a large e-commerce site with warehouse, wholesaler or ERP integrations PLN\u{00A0}15,000–\u{2060}50,000. The price depends mainly on the number of products and variants, the integrations and whether you also sell to businesses (B2B). You get a detailed quote for free after the brief.",
            ],
            [
                'question' => 'Do you build stores on Shopify or WooCommerce?',
                'answer' => 'Yes, if that’s the best route for your sales: with a smaller catalog, a ready-made platform is often the fastest start. When you need individual prices, an ERP integration or a very fast frontend, we build the store with custom code, headless included. We’ll advise you after the brief.',
            ],
            [
                'question' => 'Which payment and shipping options can you connect?',
                'answer' => 'We connect online payments through gateways such as Przelewy24 or Stripe, which means BLIK, cards and instant bank transfers, as well as cash on delivery. We set up courier and parcel locker shipping, with the cost calculated in the cart and shipping labels printed from the panel.',
            ],
            [
                'question' => 'Can you connect the store to our warehouse, wholesaler or ERP?',
                'answer' => 'Yes. We sync stock levels and prices with your wholesaler or warehouse, and orders with your ERP or accounting system, such as Comarch ERP Optima. That way you don’t retype data by hand, and customers see up-to-date availability.',
            ],
            [
                'question' => 'Will you move products and customers over from our old store?',
                'answer' => 'Yes. We move products, photos, categories and customer accounts, and redirect old product addresses to the new ones, so you don’t lose traffic from Google or links from other websites.',
            ],
            [
                'question' => 'How fast will the store be?',
                'answer' => 'We plan for speed from the start: lightweight product pages, optimized images and caching. For a large catalog, we build a headless frontend that loads fast on phones too. It matters, because every second of waiting puts some customers off.',
            ],
            [
                'question' => 'Can I add products and handle orders myself?',
                'answer' => 'Yes. In the store’s panel you add products and variants, change prices and stock levels, create discount codes and handle orders from payment to shipping. We show you how to use it at the start, and you report bigger changes as tasks in the client portal.',
            ],
        ],
    ],

    'apps' => [
        'seo' => [
            'title' => 'Custom web application development from PLN 1,699 | Netizo',
            'description' => 'Order a web app from PLN 1,699: a portal, a B2B system or a SaaS platform with integrations. A demo every two weeks, usually 2–4 months. Free quote.',
            'name' => 'Custom web application development',
            'breadcrumb' => 'Web applications',
            'image' => 'assets/images/og-netizo-web-applications-en.jpg',
            'image_alt' => 'Custom web application development from PLN 1,699 – Netizo',
        ],

        'card' => [
            'name' => 'Web applications',
            'description' => 'Portals, B2B systems and SaaS platforms with integrations and user roles.',
        ],

        'offers' => [
            [
                'name' => 'Web application',
                'description' => 'A portal, an internal system or a customer portal that organizes one process in your company, such as orders, bookings or a fleet.',
                'timeline' => "Usually 2–\u{2060}4\u{00A0}months",
                'includes' => [
                    'An analysis of the process and a written scope of work',
                    'Interface design and a clickable prototype in Figma',
                    'Log-in, user roles and permissions',
                    'An admin panel, reports and data export',
                    'API integrations, for example with accounting or payments',
                    'A demo on the staging version every two weeks',
                ],
            ],
            [
                'name' => 'Large system',
                'description' => 'A platform for many user groups, with subscriptions, ERP integrations or heavy traffic, developed in stages.',
                'includes' => [
                    'Everything in the web application',
                    'Live data and an architecture built for heavy traffic',
                    'Subscriptions and recurring payments',
                    'Integrations with ERP, CRM and partner systems',
                    'Cloud infrastructure, CI/CD and monitoring',
                    'Development in further stages and support after launch',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'How much does a web application cost?',
                'answer' => "A web application starts at PLN\u{00A0}1,699 and usually stays under PLN\u{00A0}50,000, and large systems with many user groups and integrations start at PLN\u{00A0}50,000. The price depends on the number of screens and roles, the integrations and the security and load requirements. We split larger systems into stages, so the first version reaches users quickly. The quote after the brief is free.",
            ],
            [
                'question' => 'How long does it take to build a web application?',
                'answer' => "A typical web application takes 2–\u{2060}4\u{00A0}months. We work in two-week sprints and show the progress on a staging version after each one, so you see working parts from the first weeks. For a large system, we set the timeline after the analysis, stage by stage.",
            ],
            [
                'question' => 'How is a web application different from a website?',
                'answer' => 'A website mainly presents your company and collects inquiries. A web application does work: users log in to it, have their own roles and data, and the system calculates, sends, syncs and reports. It runs in the browser, so no one has to install anything.',
            ],
            [
                'question' => 'Can you connect the application to our systems?',
                'answer' => 'Yes. We integrate applications through APIs with ERP and accounting systems, payment gateways, CRMs, calendars and SMS gateways, and when a system has no API, we find another way, such as a file exchange. We connect, for example, to Comarch ERP Optima, Google Calendar or SMS gateways such as SMSAPI.',
            ],
            [
                'question' => 'How do you keep the data secure?',
                'answer' => 'We design roles and permissions from day one, connections are encrypted, we make backups and monitor the application. Log-in can have a second factor, such as a one-time code sent by email, and only the people who need the data can access it.',
            ],
            [
                'question' => 'Will the application work on phones?',
                'answer' => 'Yes. We design web applications to work comfortably on desktops, tablets and phones. If you also need an app in the App Store and Google Play, we can build it on the same backend.',
            ],
            [
                'question' => 'What happens after the application goes live?',
                'answer' => 'We stay with you: we monitor the application, update its dependencies and add new features. You report tasks and fixes in the client portal, and with ongoing work you get a monthly statement with the hours itemized.',
            ],
        ],
    ],

    'mobile' => [
        'seo' => [
            'title' => 'iOS and Android app development from PLN 999 | Netizo',
            'description' => 'Order an iOS and Android app from PLN 999. One codebase for both platforms, a Figma design and publishing in the App Store and Google Play.',
            'name' => 'iOS and Android app development',
            'breadcrumb' => 'Mobile apps',
            'image' => 'assets/images/og-netizo-mobile-apps-en.jpg',
            'image_alt' => 'iOS and Android app development from PLN 999 – Netizo',
        ],

        'card' => [
            'name' => 'Mobile apps',
            'description' => 'iOS and Android apps from one codebase, published in the App Store and Google Play.',
        ],

        'offers' => [
            [
                'name' => 'Mobile app',
                'description' => 'An iOS and Android app with one main feature, such as orders, bookings or a loyalty program, connected to your system.',
                'includes' => [
                    'Screen design and a clickable prototype in Figma',
                    'One codebase for iOS and Android (React Native or Flutter)',
                    'Log-in and user accounts',
                    'Push notifications',
                    'A panel for managing content and users',
                    'Publishing in the App Store and Google Play',
                ],
            ],
            [
                'name' => 'Larger app',
                'description' => 'An app with its own backend, payments, several roles or offline mode, developed in stages together with the web version.',
                'includes' => [
                    'Everything in the mobile app',
                    'Its own backend and API, shared with the web version',
                    'Payments and subscriptions',
                    'Offline mode and data sync',
                    'Integrations with ERP, CRM and partner systems',
                    'Analytics, crash reports and development after launch',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'How much does a mobile app cost?',
                'answer' => "An iOS and Android app starts at PLN\u{00A0}999 and usually stays under PLN\u{00A0}50,000, and a larger app with its own backend, payments and several roles starts at PLN\u{00A0}50,000. The price depends on the number of screens, features and integrations. We split larger apps into stages, so the first version reaches users quickly. The quote after the brief is free.",
            ],
            [
                'question' => 'Will the app work on both iPhone and Android?',
                'answer' => 'Yes. We build apps from one codebase in React Native or Flutter, so they run on iOS and Android with full performance on both. One codebase means less work and easier growth, and when a feature needs native code, we add it.',
            ],
            [
                'question' => 'How long does it take to build a mobile app?',
                'answer' => 'We give you the timeline after the brief, because it depends on the number of screens and integrations. We work in two-week sprints, and after each one you get a test version of the app to install on your phone, so you see the progress from the first weeks. The plan also includes time for the Apple and Google store reviews.',
            ],
            [
                'question' => 'Will you publish the app in the App Store and Google Play?',
                'answer' => 'Yes. We prepare the descriptions, screenshots and required privacy details, submit the app for review and fix whatever Apple or Google ask for. Ideally, the app is published on your company’s developer account: then the store listing and the reviews belong to you.',
            ],
            [
                'question' => 'A mobile app or a web application?',
                'answer' => 'A mobile app makes sense when customers use it often, or when you need push notifications, the camera, location or working offline. If users drop by rarely or work mostly at a desktop, a web application is enough. We often build both on a shared backend.',
            ],
            [
                'question' => 'Can the app connect to our system?',
                'answer' => 'Yes. We connect apps through APIs to ERP and CRM systems, payments and calendars, and if needed, we build the backend and the admin panel from scratch. Then the same logic serves the mobile app and the web version.',
            ],
            [
                'question' => 'What happens after the app is published?',
                'answer' => 'We stay with you: we update the app for new versions of iOS and Android, monitor crashes and add new features. You report tasks in the client portal, and with ongoing work you get a monthly statement with the hours itemized.',
            ],
        ],
    ],

    'ai' => [
        'seo' => [
            'title' => 'AI and automation for businesses from PLN 299 | Netizo',
            'description' => 'Order an automation or an AI rollout from PLN 299: a chatbot on your company’s data, document workflows and CRM integrations. Free quote.',
            'name' => 'AI and automation for businesses',
            'breadcrumb' => 'AI & automation',
            'image' => 'assets/images/og-netizo-ai-automation-en.jpg',
            'image_alt' => 'AI and automation for businesses from PLN 299 – Netizo',
        ],

        'card' => [
            'name' => 'AI & automation',
            'description' => 'Chatbots on your company’s data, document reading and automations connected to your CRM and ERP.',
        ],

        'offers' => [
            [
                'name' => 'Chatbot or automation',
                'description' => 'One process automated end to end, such as answering customers’ repeated questions, reading invoices or copying requests into the CRM.',
                'includes' => [
                    'Process analysis and a choice of what AI does well',
                    'A chatbot that answers from your documents and offer',
                    'An integration with one system, such as a CRM, email or a spreadsheet',
                    'A handover to a person when the AI doesn’t know the answer',
                    'A panel with the history of conversations and tasks',
                    'Tests on real examples before launch',
                ],
            ],
            [
                'name' => 'AI agent with integrations',
                'description' => 'A system that handles several steps of a process: it reads documents and messages, makes simple decisions by your rules and saves the results in your company’s systems.',
                'includes' => [
                    'Everything in the single automation',
                    'Integrations with ERP, CRM, email and your document base',
                    'Agents that carry out the process step by step',
                    'Rules, approvals and a log of every decision',
                    'Model selection and control of its usage costs',
                    'Quality monitoring and development after launch',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'How much does an AI or automation rollout cost?',
                'answer' => "A single automation or chatbot starts at PLN\u{00A0}299 and usually stays under PLN\u{00A0}15,000, and an AI agent integrated with several of your company’s systems PLN\u{00A0}15,000–\u{2060}50,000. On top of that comes the cost of using the AI models, which depends on the number of requests; we estimate it before the rollout. The quote after the brief is free.",
            ],
            [
                'question' => 'What can be automated?',
                'answer' => 'Repetitive tasks with clear rules work best: answering customers’ frequent questions, reading invoices and orders, copying data between systems, sorting messages and preparing reports. We start by talking about what takes your team the most time today.',
            ],
            [
                'question' => 'Can the AI make mistakes?',
                'answer' => 'Yes, which is why we build automations with safeguards: the AI answers from your documents, hands the case to a person when it’s unsure, and important decisions wait for approval. We log every action, so it’s easy to check what happened and why.',
            ],
            [
                'question' => 'What about our company’s and customers’ data?',
                'answer' => 'Before the rollout, we agree on what data goes to the model and send only what the task needs. We choose services that don’t train models on the data sent to them, and we keep keys and access details in an encrypted vault. If the data can’t leave your company, we consider a model running on your own server.',
            ],
            [
                'question' => 'Which AI models do you use?',
                'answer' => 'We choose the model for the task: OpenAI, Anthropic or Google models for conversations and longer texts, smaller and cheaper ones for simpler tasks, and open-source models run locally for sensitive data. That way you don’t overpay for power the task doesn’t need.',
            ],
            [
                'question' => 'How long does a rollout take?',
                'answer' => 'We give you the timeline after the process analysis. We start with one process and show you a working test version on your own examples, and we add further automations in stages once the first one delivers results.',
            ],
            [
                'question' => 'Can you connect the AI to our systems?',
                'answer' => 'Yes. We connect automations through APIs to CRMs, ERPs, email, calendars and document bases, and save the results where your team already works. You don’t need to change your tools to get started.',
            ],
        ],
    ],

    'devops' => [
        'seo' => [
            'title' => 'DevOps and cloud for businesses from PLN 499 | Netizo',
            'description' => 'Order a DevOps setup from PLN 499: a server or the cloud, CI/CD, backups and 24/7 monitoring. Deployments without downtime. Free quote.',
            'name' => 'DevOps and cloud for businesses',
            'breadcrumb' => 'DevOps & cloud',
            'image' => 'assets/images/og-netizo-devops-cloud-en.jpg',
            'image_alt' => 'DevOps and cloud for businesses from PLN 499 – Netizo',
        ],

        'card' => [
            'name' => 'DevOps & cloud',
            'description' => 'Servers and the cloud, CI/CD, backups and monitoring, so deployments are fast and safe.',
        ],

        'offers' => [
            [
                'name' => 'Setup and CI/CD',
                'description' => 'A server or a cloud account set up from scratch, automated tests and deployments from the repository, backups and uptime monitoring.',
                'includes' => [
                    'An audit of your current server or hosting',
                    'Server or cloud setup (AWS, GCP, Vercel)',
                    'CI/CD: tests and a deployment after every change in the repository',
                    'An SSL certificate, a firewall and security updates',
                    'Automatic backups with a restore test',
                    'Uptime monitoring with notifications',
                ],
            ],
            [
                'name' => 'Infrastructure as code',
                'description' => 'Infrastructure described in code, containers and test environments, a cloud migration without downtime and monitoring of the whole system.',
                'includes' => [
                    'Everything in the setup and CI/CD',
                    'Infrastructure as code (Terraform) and containers (Docker)',
                    'Kubernetes, when the system needs it',
                    'A cloud migration without downtime',
                    'A test environment for every change',
                    'Monitoring, logs and 24/7 alerts',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'How much do DevOps and cloud work cost?',
                'answer' => "A server or cloud setup with CI/CD and backups starts at PLN\u{00A0}499 and usually stays under PLN\u{00A0}5,000, and infrastructure as code with a cloud migration and monitoring of the whole system costs PLN\u{00A0}5,000–\u{2060}15,000. On top of that comes the monthly cost of the servers or the cloud, which we estimate up front. The quote after the brief is free.",
            ],
            [
                'question' => 'Can you move our website or app without downtime?',
                'answer' => 'Yes. We plan the migration so the new environment runs alongside the old one, and we switch the domain only after testing. If something goes wrong, we roll back to the previous version.',
            ],
            [
                'question' => 'Which clouds do you use?',
                'answer' => 'Most often AWS, Google Cloud and Vercel, and for simpler projects a well-configured VPS. We choose the setup for the traffic, the requirements and the budget, not the other way round.',
            ],
            [
                'question' => 'Will you take care of a server you didn’t build?',
                'answer' => 'Yes. We start with an audit: we check the configuration, backups, updates and security, then fix what’s a risk. You don’t need to move your system to work with us.',
            ],
            [
                'question' => 'How does 24/7 monitoring work?',
                'answer' => 'Automated checks every few minutes test whether your website and app are up and how fast they respond. When something stops working, we get an alert and act on it, and we keep you posted about incidents in the client portal.',
            ],
            [
                'question' => 'How much does running a server or the cloud cost?',
                'answer' => 'It depends on the traffic and the services your system uses. Before we launch anything, we show you an estimate of the monthly costs and point out where to save, for example on server sizes or services you don’t need.',
            ],
            [
                'question' => 'Do you provide support after the rollout?',
                'answer' => 'Yes. We update the systems, look after the backups and act on alerts, and you report tasks in the client portal. With ongoing work, you get a monthly statement with the hours itemized.',
            ],
        ],
    ],
];
