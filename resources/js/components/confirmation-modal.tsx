import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    ExclamationTriangleIcon,
    ExclamationCircleIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

interface ConfirmationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    loading?: boolean;
    onConfirm: () => void;
}

export function ConfirmationModal({
    open,
    onOpenChange,
    title = 'Konfirmasi Tindakan',
    description = 'Apakah Anda yakin ingin melanjutkan tindakan ini? Data yang dihapus tidak dapat dipulihkan.',
    confirmText = 'Iya, Hapus',
    cancelText = 'Tidak',
    variant = 'danger',
    loading = false,
    onConfirm,
}: ConfirmationModalProps) {
    const isDanger = variant === 'danger';
    const isWarning = variant === 'warning';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white border border-[#D8D2C6] p-6 shadow-xl rounded-sm">
                <div className="flex items-start gap-4">
                    <div
                        className={`p-2.5 rounded-full shrink-0 border ${
                            isDanger
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : isWarning
                                ? 'bg-amber-50 text-amber-600 border-amber-200'
                                : 'bg-[#0F2C59]/10 text-[#0F2C59] border-[#0F2C59]/20'
                        }`}
                    >
                        {isDanger ? (
                            <ExclamationTriangleIcon className="w-6 h-6 stroke-2" />
                        ) : isWarning ? (
                            <ExclamationCircleIcon className="w-6 h-6 stroke-2" />
                        ) : (
                            <QuestionMarkCircleIcon className="w-6 h-6 stroke-2" />
                        )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                        <DialogHeader className="text-left space-y-1">
                            <DialogTitle className="text-base font-serif font-bold text-[#1A2228] leading-snug">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-[#5A626A] leading-relaxed">
                                {description}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2DFD7] flex items-center justify-end gap-2.5">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={loading}
                        onClick={() => onOpenChange(false)}
                        className="text-xs border-[#D8D2C6] text-[#1A2228] hover:bg-[#FAF9F6] h-8 px-3.5"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                            onConfirm();
                        }}
                        className={`text-xs font-semibold h-8 px-4 transition-colors ${
                            isDanger
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                                : isWarning
                                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                                : 'bg-[#0F2C59] hover:bg-[#0A1F3F] text-white shadow-xs'
                        }`}
                    >
                        {loading ? 'Memproses...' : confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
