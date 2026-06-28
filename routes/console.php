<?php

use Illuminate\Support\Facades\Schedule;

// ponytail: no scheduled tasks needed yet — TeamInvitation was removed as it's not part of this project
Schedule::command('queue:prune-failed')->daily();
