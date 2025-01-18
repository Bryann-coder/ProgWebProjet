<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Workday;

class UpdateWorkdayStatus extends Command
{
    protected $signature = 'workdays:update-status';
    protected $description = 'Update the status of workdays';

    public function handle()
    {
        $today = now()->toDateString();
        Workday::where('date', '<', $today)->where('status', 0)->update(['status' => 1]);
    }
}
