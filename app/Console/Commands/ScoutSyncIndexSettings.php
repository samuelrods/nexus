<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Meilisearch\Client;

class ScoutSyncIndexSettings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scout:sync-index-settings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Scout index settings to Meilisearch';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $host = config('scout.meilisearch.host');
        $key = config('scout.meilisearch.key');

        $this->info("Connecting to Meilisearch at: $host");

        $client = new Client($host, $key);

        $settings = config('scout.meilisearch.index-settings', []);

        foreach ($settings as $index => $indexSettings) {
            $this->info("Syncing settings for index: $index");
            
            $client->index($index)->updateSettings($indexSettings);
        }

        $this->info('Scout index settings synced successfully.');
    }
}
