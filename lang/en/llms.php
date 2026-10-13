<?php

/*
 * Copy of the English sections of /llms.txt (App\Services\LlmsTxt). Polish twin: lang/pl/llms.php (same keys).
 */
return [
    'intro' => 'The site is bilingual: the Polish version is at :polish and the English one at :english. The Polish sections come first, then the same ones in English. This Netizo (netizo.pl, Poland) is not affiliated with the Indian agency of the same name (netizo.in).',

    'headings' => [
        'pages' => 'Pages',
        'services' => 'Services',
        'projects' => 'Case studies',
        'faq' => 'Frequently asked questions',
        'partner_faq' => 'Partner program: frequently asked questions',
        'service_faq' => ':service: frequently asked questions',
        'leszno_faq' => 'Websites in and around Leszno: frequently asked questions',
        'contact' => 'Contact',
    ],

    'pages' => [
        'home' => [
            'name' => 'Home page',
            'note' => 'services, selected projects, how we work, the client portal, FAQ with prices and timelines, the contact form and the project brief.',
        ],
        'websites' => [
            'name' => 'Website development',
            'note' => 'a simple website (landing page, business card site) from PLN 799 to PLN 1,499, usually within a week, a larger website with a CMS from PLN 1,799 to PLN 2,999, usually within two weeks; scope, process, projects and FAQ.',
        ],
        'leszno' => [
            'name' => 'Website development in and around Leszno',
            'note' => 'websites for businesses in Leszno, Rydzyna, Wschowa, Kościan, Gostyń, Rawicz and nearby: we come to a meeting at the client’s company (no office in Leszno, registered address in Kępno), the same prices as on the service page (from PLN 799), projects from the region, client testimonials and frequently asked questions.',
        ],
        'stores' => [
            'name' => 'Online store development',
            'note' => 'a small store from PLN 1,299 to PLN 4,999, usually within four weeks, a large e-commerce site with warehouse, wholesaler or ERP integration from PLN 5,499 to PLN 12,999, usually within eight weeks; payments, shipping, projects and FAQ.',
        ],
        'apps' => [
            'name' => 'Custom web application development',
            'note' => 'a web application from PLN 1,699 to PLN 3,999, usually within three weeks, a large system from PLN 4,499, built in stages; integrations, security, projects and FAQ.',
        ],
        'mobile' => [
            'name' => 'iOS and Android app development',
            'note' => 'a mobile app from PLN 999 to PLN 3,999, usually within three weeks, a larger app with its own backend from PLN 4,499, built in stages; one codebase for iOS and Android, publishing in the App Store and Google Play, projects and FAQ.',
        ],
        'ai' => [
            'name' => 'AI and automation',
            'note' => 'a chatbot or a single automation from PLN 299 to PLN 1,499, usually within a week, an AI agent integrated with the company’s systems from PLN 1,999 to PLN 4,999, usually within three weeks; answers based on the company’s documents, approvals and logs, data security, model costs and FAQ.',
        ],
        'devops' => [
            'name' => 'DevOps and cloud for businesses',
            'note' => 'a server or cloud setup with CI/CD and backups from PLN 499 to PLN 1,499, usually within a week, infrastructure as code and a cloud migration from PLN 1,999 to PLN 4,999, usually within two weeks; 24/7 monitoring, security, cloud costs and FAQ.',
        ],
        'projects' => [
            'name' => 'Projects',
            'note' => 'every project, each with its own case study: the project, challenges, solutions, results and technologies.',
        ],
        'about' => [
            'name' => 'About us',
            'note' => 'the co-owners Damian Idzik and Kamil Nawrot, how we work (remotely across Poland, in person around Leszno), selected projects and company details.',
        ],
        'partners' => [
            'name' => 'Partner program',
            'note' => '15% of the net value of every invoice a referred client pays for 12 months from their first order, paid within 14 days of the invoice being paid, free to join with no referral limit; a commission calculator, the rules and the application form.',
        ],
    ],

    'services' => [
        ['name' => 'Websites', 'note' => 'Company websites and landing pages that load fast and do well in Google.', 'page' => 'websites'],
        ['name' => 'Mobile apps', 'note' => 'One codebase for iOS and Android, with full performance on both.', 'page' => 'mobile'],
        ['name' => 'AI & automation', 'note' => 'Chatbots, AI integrations and process automation.', 'page' => 'ai'],
        ['name' => 'Web applications', 'note' => 'Portals, B2B systems and SaaS platforms with their own API and integrations.', 'page' => 'apps'],
        ['name' => 'DevOps & cloud', 'note' => 'Infrastructure as code, CI/CD, containers and 24/7 monitoring.', 'page' => 'devops'],
        ['name' => 'Online stores', 'note' => 'Stores with online payments, shipping and warehouse or ERP integration.', 'page' => 'stores'],
    ],

    'live_site' => 'Live site: :url',

    'contact' => [
        'form' => [
            'name' => 'Contact form and project brief',
            'note' => 'email :email, phone :telephone. We reply within 24 hours, and the quote is free.',
        ],
        'company' => [
            'name' => 'Company details',
            'note' => 'Netizo, NIP (tax ID) :tax_id, REGON :regon, registered address: :address (no office for clients to visit).',
        ],
    ],

    'documents' => [
        'privacy' => 'Privacy policy',
        'terms' => 'Terms of service',
        'partner_terms' => 'Partner program terms',
    ],

    'anchors' => [
        'services' => 'services',
        'faq' => 'faq',
        'contact' => 'contact',
        'partner_faq' => 'faq',
        'service_faq' => 'faq',
        'leszno_faq' => 'faq',
        'company' => 'company-details',
    ],
];
