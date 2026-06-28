<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Fortify;
use Laravel\Passkeys\Contracts\PasskeyLoginResponse as PasskeyLoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class PasskeyLoginResponse implements PasskeyLoginResponseContract
{
    public function toResponse($request): Response
    {
        $user = $request->user();
        $redirectUrl = $user && $user->isAdmin()
            ? route('admin.quizzes.index')
            : route('student.quizzes.index');

        return $request->wantsJson()
            ? new JsonResponse(['redirect' => redirect()->intended($redirectUrl)->getTargetUrl()], 200)
            : redirect()->intended($redirectUrl);
    }
}
