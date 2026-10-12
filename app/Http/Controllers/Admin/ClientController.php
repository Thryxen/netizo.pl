<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ReordersRecords;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DestroyManyRequest;
use App\Http\Requests\Admin\ReorderRequest;
use App\Http\Requests\Admin\SaveClientRequest;
use App\Models\Client;
use App\Services\IndexNow;
use App\Services\LocalizedRoutes;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    use ReordersRecords;

    public function __construct(private IndexNow $indexNow) {}

    public function index(): Response
    {
        return Inertia::render('admin/clients/index', [
            'clients' => Client::query()->ordered()->orderBy('id')->get()
                ->map(fn (Client $client): array => $this->props($client))
                ->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/clients/create', [
            'nextSortOrder' => (int) Client::query()->max('sort_order') + 1,
        ]);
    }

    public function store(SaveClientRequest $request): RedirectResponse
    {
        $client = Client::query()->create($request->clientAttributes());

        $this->announce($client->is_active);

        return to_route('admin.clients.index')->with('success', "Dodano klienta „{$client->name}”.");
    }

    public function edit(Client $client): Response
    {
        return Inertia::render('admin/clients/edit', [
            'client' => $this->props($client),
        ]);
    }

    public function update(SaveClientRequest $request, Client $client): RedirectResponse
    {
        $wasPublic = $client->is_active;

        $client->update($request->clientAttributes());

        $this->announce($wasPublic || $client->is_active);

        return to_route('admin.clients.index')->with('success', "Zapisano klienta „{$client->name}”.");
    }

    public function destroy(Client $client): RedirectResponse
    {
        $client->delete();

        $this->announce($client->is_active);

        return to_route('admin.clients.index')->with('success', "Usunięto klienta „{$client->name}”.");
    }

    public function destroyMany(DestroyManyRequest $request): RedirectResponse
    {
        $anyPublic = Client::query()->whereKey($request->ids())->active()->exists();

        $count = Client::query()->whereKey($request->ids())->delete();

        $this->announce($anyPublic);

        return back()->with('success', "Usunięto klientów: {$count}.");
    }

    public function reorder(ReorderRequest $request): RedirectResponse
    {
        $this->applyOrder(Client::query(), $request->ids());

        return back();
    }

    /**
     * Tell the search engines (IndexNow, after the response) that the home page changed when a public client did: the
     * page lists their names. Hidden clients send nothing, nor does the order (saved on every drop in the panel).
     */
    private function announce(bool $publicClientChanged): void
    {
        if ($publicClientChanged) {
            $this->indexNow->submitAfterResponse(array_values(LocalizedRoutes::alternates('home')));
        }
    }

    /**
     * @return array{id: int, name: string, url: string|null, sortOrder: int, isActive: bool, updatedAt: string}
     */
    private function props(Client $client): array
    {
        return [
            'id' => $client->id,
            'name' => $client->name,
            'url' => $client->url,
            'sortOrder' => (int) $client->sort_order,
            'isActive' => (bool) $client->is_active,
            'updatedAt' => $client->updated_at?->format('d.m.Y H:i') ?? '',
        ];
    }
}
