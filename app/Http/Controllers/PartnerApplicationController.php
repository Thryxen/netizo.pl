<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePartnerApplicationRequest;
use App\Models\PartnerApplication;
use App\Services\DiscordWebhookService;
use Illuminate\Http\RedirectResponse;

class PartnerApplicationController extends Controller
{
    /**
     * Store an application to the partner programme, with the version of the programme terms its sender accepted, and
     * notify the team on Discord.
     */
    public function store(StorePartnerApplicationRequest $request, DiscordWebhookService $discord): RedirectResponse
    {
        $data = [
            'locale' => app()->getLocale(),
            ...$request->safe()->except('terms'),
            'terms_version' => LegalPageController::PARTNER_TERMS_EFFECTIVE_DATE,
        ];

        PartnerApplication::create($data);

        $discord->sendPartnerApplication($data);

        return back();
    }
}
