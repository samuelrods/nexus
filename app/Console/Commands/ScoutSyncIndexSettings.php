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

        if (empty($host)) {
            $this->error('Meilisearch host is not configured.');
            return;
        }

        $this->info("Connecting to Meilisearch at: $host");

        try {
            $client = new Client($host, $key);
            
            // Simple check to see if we can connect
            $client->health();
            $this->info('Meilisearch connection successful.');

            $settings = config('scout.meilisearch.index-settings', []);

            if (empty($settings)) {
                $this->warn('No Scout index settings found in config.');
                return;
            }

            foreach ($settings as $index => $indexSettings) {
                $this->info("Syncing settings for index: $index");
                
                $client->index($index)->updateSettings($indexSettings);
            }

            $this->info('Scout index settings synced successfully.');
        } catch (\Exception $e) {
            $this->error('Failed to sync Scout index settings: ' . $e->getMessage());
            // Exit with error code to signal failure to entrypoint
            exit(1);
        }
    }
}
