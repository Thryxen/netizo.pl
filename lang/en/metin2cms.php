<?php

/*
 * Server-side copy of the Metin2 CMS page (Metin2CmsController, /en/metin2cms): the meta tags and the FAQ, the single
 * source for the page and its JSON-LD. Polish twin: lang/pl/metin2cms.php (same keys, same figures).
 */
return [
    'seo' => [
        'title' => 'Metin2 CMS – server website and panel | Netizo',
        'description' => 'A ready-made CMS for Metin2 servers: the website, the player panel and the admin panel. Redis cache, zero-downtime deploys, code you own, maintenance.',
        'name' => 'CMS for Metin2 servers',
        'breadcrumb' => 'Metin2 CMS',
        'image' => 'assets/images/og-netizo-en.png',
        'image_alt' => 'Netizo – a CMS for Metin2 servers: the website, the player panel and the admin panel',
    ],

    'faq' => [
        [
            'question' => 'Which server files does the CMS work with?',
            'answer' => 'The system is built for the database layout of the Marty Sama files: the account, player, common and log databases. We connect it to a running server without any changes to the game. If your files have other tables or extra systems, we adjust the reads during the deployment.',
        ],
        [
            'question' => 'Does the website put load on the game database?',
            'answer' => 'As little as possible, because the game runs only as smoothly as its database. The player and guild rankings refresh every 30 minutes, so the game database gets two queries an hour however many visitors there are. The signed-in account is cached in Redis for 60 seconds, and the players-online chart reads only the new log rows by primary key every 5 minutes. We tune the TTLs to your server.',
        ],
        [
            'question' => 'Do I get the source code?',
            'answer' => 'Yes. After the deployment we hand over the repository with all the code of the website and the panel. The code is yours: you can develop it with us, with your own developer or on your own.',
        ],
        [
            'question' => 'How is the website updated while the server is running?',
            'answer' => 'We use zero-downtime deploys: we build the new release beside the running one and switch the traffic atomically only once it is ready. There is no maintenance mode and no players signed out, and should anything go wrong, we roll back to the previous version.',
        ],
        [
            'question' => 'Can I order a feature that is not included?',
            'answer' => 'Yes. We add custom modules to order, for example an item shop in the browser, Vote4Coins, an item wiki or another language. Smaller changes usually take a few days, because the system is built to be easy to extend.',
        ],
        [
            'question' => 'Which payments does the system support?',
            'answer' => 'Top-ups through CashBill are included: BLIK, fast bank transfers and cards. You set the coin packages, bonuses and time-limited promotions in the panel yourself, and you see every payment with its status at the payment provider. We connect another payment provider to order.',
        ],
        [
            'question' => 'Who looks after the website after launch?',
            'answer' => 'We do. As part of maintenance we watch that the website runs, make backups, install updates and security patches and make the changes you ask for. We reply to requests within 24 hours.',
        ],
        [
            'question' => 'How much does a deployment cost?',
            'answer' => 'The price depends on the server files, the look of the website and the modules made to order. We prepare a free quote after a short conversation, usually within 24 hours.',
        ],
    ],
];
