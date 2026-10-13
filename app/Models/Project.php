<?php

namespace App\Models;

use App\Enums\Service;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    protected $fillable = [
        'slug',
        'sort_order',
        'is_active',
        'services',
        'is_local',
        'title',
        'url',
        'category',
        'description',
        'full_description',
        'thumbnail_image',
        'full_image',
        'tech_stack',
        'metrics',
        'challenges',
        'solutions',
        'category_en',
        'description_en',
        'full_description_en',
        'metrics_en',
        'challenges_en',
        'solutions_en',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'services' => 'array',
        'is_local' => 'boolean',
        'tech_stack' => 'array',
        'metrics' => 'array',
        'challenges' => 'array',
        'solutions' => 'array',
        'metrics_en' => 'array',
        'challenges_en' => 'array',
        'solutions_en' => 'array',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    /**
     * Projects tagged in the admin panel with the service, shown on its page.
     */
    public function scopeForService($query, Service $service)
    {
        return $query->whereJsonContains('services', $service->value);
    }

    /**
     * Projects for clients from the region, marked in the admin panel and shown on the Leszno page.
     */
    public function scopeLocal($query)
    {
        return $query->where('is_local', true);
    }
}
