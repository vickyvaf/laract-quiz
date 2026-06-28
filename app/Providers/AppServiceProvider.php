<?php

namespace App\Providers;

use App\Models\User;
use App\Services\ActivityLogger;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        // Register Auth event listeners
        Event::listen(
            Login::class,
            function (Login $event): void {
                /** @var User $user */
                $user = $event->user;
                ActivityLogger::log('login', "User '{$user->email}' logged in successfully.");
            }
        );

        Event::listen(
            Logout::class,
            function (Logout $event): void {
                $email = $event->user instanceof User ? $event->user->email : 'Unknown';
                ActivityLogger::log('logout', "User '{$email}' logged out.");
            }
        );

        Event::listen(
            Registered::class,
            function (Registered $event): void {
                /** @var User $user */
                $user = $event->user;
                ActivityLogger::log('register', "New user registered: '{$user->email}'.");
            }
        );
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
