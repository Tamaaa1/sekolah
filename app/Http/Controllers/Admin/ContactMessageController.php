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

        $status = $request->query('status', '');
        if ($status === 'unread') {
            $query->where('is_read', false);
        } elseif ($status === 'read') {
            $query->where('is_read', true);
        }

        $messages = $query->latest('id')
            ->paginate(15)
            ->withQueryString();

        $counts = [
            'all' => ContactMessage::count(),
            'unread' => ContactMessage::where('is_read', false)->count(),
            'read' => ContactMessage::where('is_read', true)->count(),
        ];

        return Inertia::render('admin/messages/index', [
            'messages' => $messages,
            'counts' => $counts,
            'unreadCount' => $counts['unread'],
            'currentStatus' => $status,
            'filters' => [
                'q' => $request->query('q', ''),
                'status' => $status,
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
