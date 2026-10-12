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
        'contact' => 'Contact',
    ],

    'pages' => [
        'home' => [
            'name' => 'Home page',
            'note' => 'services, selected projects, how we work, the client portal, FAQ with prices and timelines, the contact form and the project brief.',
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
        ['name' => 'Web applications', 'note' => 'Modern SPA and SSR apps, from simple landing pages to complex SaaS platforms.'],
        ['name' => 'Mobile apps', 'note' => 'One codebase for iOS and Android, with full performance on both.'],
        ['name' => 'AI & automation', 'note' => 'Chatbots, AI integrations and process automation.'],
        ['name' => 'Backend systems', 'note' => 'Scalable APIs and microservices built for heavy load.'],
        ['name' => 'DevOps & cloud', 'note' => 'Infrastructure as code, CI/CD, containers and 24/7 monitoring.'],
        ['name' => 'E-commerce', 'note' => 'Online stores and marketplaces with payment and fulfillment integrations.'],
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
        'company' => 'company-details',
    ],
];
