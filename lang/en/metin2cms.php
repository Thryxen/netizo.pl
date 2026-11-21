<?php

/*
 * Server-side copy of the Metin2 CMS page (Metin2CmsController, /en/metin2cms): the meta tags and the FAQ, the single
 * source for the page and its JSON-LD. Polish twin: lang/pl/metin2cms.php (same keys, same figures).
 */
return [
    'seo' => [
        'title' => 'Metin2 CMS – private server website and panels | Netizo',
        'description' => 'A ready-made CMS for Metin2 private servers: a website with rankings, a player panel, top-ups and an admin panel. Deployed for you, code you own.',
        'name' => 'CMS for Metin2 servers',
        'breadcrumb' => 'Metin2 CMS',
        'service_type' => 'CMS for Metin2 private servers',
        'audience' => 'Owners and administrators of Metin2 private servers',
        'image' => 'assets/images/og-netizo-metin2cms-en.jpg',
        'image_alt' => 'Netizo – a CMS for Metin2 servers: the website, the player panel and the admin panel',
    ],

    'faq' => [
        [
            'question' => 'Which server files does the CMS work with?',
            'answer' => 'The system is built for the database layout of the Marty Sama files: the account, player, common and log databases. We connect it to a running server without any changes to the game. If your files have other tables or extra systems, we adjust the reads during the deployment.',
        ],
        [
            'question' => 'How is this CMS different from the free Metin2 CMSes?',
            'answer' => 'A free CMS you download and maintain yourself: fitting it to your files, security fixes and updates are on you. With us you get a deployment on your game database, a look designed for your server and a cache that keeps queries away from the database. If you want, we also take on maintenance with zero-downtime deploys. The code is yours all the same.',
        ],
        [
            'question' => 'Will the server website have its own look?',
            'answer' => 'Yes. We design the look for the server: the graphics, the colors and the header of the website. The system underneath stays the same, so the player panel and the admin panel work from day one. See the deployments section for an example: Sherkan’s website was designed entirely for that server.',
        ],
        [
            'question' => 'Which payments does the system support?',
            'answer' => 'Top-ups through one payment provider of your choice are included: usually BLIK, fast bank transfers and cards. You set the coin packages, bonuses and time-limited promotions in the panel yourself, and you see every payment with its status at the payment provider. We connect another provider to order.',
        ],
        [
            'question' => 'Does the CMS have an item shop?',
            'answer' => 'Top-ups are included: a player buys a coin package on the website and the coins land on their account. An item shop in the browser, with a list of items bought straight from the website, we add as a module made to order.',
        ],
        [
            'question' => 'Can I order a feature that is not included?',
            'answer' => 'Yes, we build any idea you have. We add custom modules to order, for example an item shop in the browser, Vote4Coins, an item wiki or another language. Smaller changes usually take a few days, because the system is built to be easy to extend. You add a new feature in the client portal as a task in the right category: we quote it and, once you accept, we start.',
        ],
        [
            'question' => 'Does the website put load on the game database?',
            'answer' => 'As little as possible, because the game runs only as smoothly as its database. The player and guild rankings refresh every 30 minutes, so the game database gets two queries an hour however many visitors there are. The signed-in account is cached in Redis for 60 seconds, and the players-online chart reads only the new log rows by primary key every 5 minutes. We tune the TTLs to your server.',
        ],
        [
            'question' => 'How does the system protect the server from bots and multi-accounts?',
            'answer' => 'Sign-up has hCaptcha, email confirmation and a limit of attempts per address. After five failed attempts the login locks for a minute, and signing in also takes the PIN. In the admin panel the connection graph shows accounts that share an IP and hardware, and an HWID ban closes the game for a given computer.',
        ],
        [
            'question' => 'Do I get the source code?',
            'answer' => 'Yes. After the deployment you download all the code of the website and the panel in the Netizo client portal. The code is yours: you can develop it with us, with your own developer or on your own.',
        ],
        [
            'question' => 'Who looks after the website after launch?',
            'answer' => 'That is your call. Maintenance is optional: as part of it we watch that the website runs, make backups, install updates and security patches and make the changes you ask for, and we reply to requests within 24 hours. You report bugs and changes in the client portal as tasks and see what stage each is at. You can also run the website yourself or with your own developer, because the code is yours.',
        ],
        [
            'question' => 'How is the website updated while the server is running?',
            'answer' => 'When we maintain the website, we use zero-downtime deploys: we build the new release beside the running one and switch the traffic atomically only once it is ready. There is no maintenance mode and no players signed out, and should anything go wrong, we roll back to the previous version. Without maintenance you deploy updates your own way: the code is yours and you download it in the client portal.',
        ],
        [
            'question' => 'How much does a deployment cost?',
            'answer' => 'The price depends on the server files, the look of the website and the modules made to order. We prepare a free quote after a short conversation, usually within 24 hours.',
        ],
    ],
];
