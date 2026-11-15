<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of received contact messages.
     */
    public function index(Request $request): Response
    {
        $query = ContactMessage::query();

        if ($request->filled('q')) {
            $keyword = trim($request->query('q'));
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%")
                  ->orWhere('phone', 'like', "%{$keyword}%")
                  ->orWhere('subject', 'like', "%{$keyword}%")
                  ->orWhere('message', 'like', "%{$keyword}%");
            });
        }

        if ($request->query('status') === 'unread') {
            $query->where('is_read', false);
        } elseif ($request->query('status') === 'read') {
            $query->where('is_read', true);
        }

        $messages = $query->latest('id')
            ->paginate(15)
            ->withQueryString();

        $unreadCount = ContactMessage::where('is_read', false)->count();

        return Inertia::render('admin/messages/index', [
            'messages' => $messages,
            'unreadCount' => $unreadCount,
            'filters' => [
                'q' => $request->query('q', ''),
                'status' => $request->query('status', 'all'),
            ],
        ]);
    }

    /**
     * Toggle read/unread status of a message.
     */
    public function toggleRead(ContactMessage $message): RedirectResponse
    {
        $message->is_read = !$message->is_read;
        $message->save();

        $statusText = $message->is_read ? 'ditandai sudah dibaca' : 'ditandai belum dibaca';
        return redirect()->back()->with('success', "Pesan dari {$message->name} {$statusText}.");
    }

    /**
     * Remove the specified message from storage.
     */
    public function destroy(ContactMessage $message): RedirectResponse
    {
        $sender = $message->name;
        $subject = $message->subject;
        $message->delete();

        ActivityLogger::log('delete', 'Kotak Masuk Pesan', "Menghapus pesan kontak dari '{$sender}' ({$subject})");

        return redirect()->back()->with('success', "Pesan dari {$sender} berhasil dihapus.");
    }
}
