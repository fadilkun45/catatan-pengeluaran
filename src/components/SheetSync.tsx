import { Box, Button, HStack, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../services/db/db'
import { flush, setSheetUrl, useSyncStore } from '../services/sync'

const usePending = () => useLiveQuery(() => db.syncQueue.count(), []) ?? 0

// Navbar badge: grey = not connected, green = all sent, yellow = waiting in the outbox, red = last send failed.
export const SheetStatus = ({ onClick }: { onClick: () => void }) => {
    const { url, error } = useSyncStore()
    const pending = usePending()
    const color = !url ? 'gray.300' : error ? 'red.400' : pending ? 'yellow.300' : 'white'
    return (
        <Button size="sm" variant="ghost" color="white" _hover={{ bg: 'green.500' }} onClick={onClick} data-testid="sheet-status"
            aria-label={!url ? 'Google Sheet belum terhubung' : error ? 'Gagal kirim ke Sheet' : pending ? `${pending} belum terkirim ke Sheet` : 'Semua terkirim ke Sheet'}>
            <Box as="span" w="2" h="2" rounded="full" bg={color} mr="2" />
            Sheet{url && pending > 0 ? ` (${pending})` : ''}
        </Button>
    )
}

export const SheetSettings = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { url: savedUrl, sending, error: syncError } = useSyncStore()
    const pending = usePending()
    const [url, setUrl] = useState(savedUrl)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    const save = async () => {
        setSaving(true)
        try { await setSheetUrl(url); setError('') } catch (e) { setError((e as Error).message) }
        setSaving(false)
    }

    const status = !savedUrl ? 'Belum terhubung' : sending ? 'Mengirim…' : pending ? `${pending} catatan belum terkirim` : 'Semua catatan sudah terkirim'

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sinkron ke Google Sheet</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize="sm" mb="3">
                        Catatan tetap disimpan di HP dan bisa dipakai offline. Saat online, catatan baru dan yang dihapus dikirim ke Sheet.
                        Cara bikin link ada di <Link color="green.600" href="https://github.com/fadilkun45/catatan-pengeluaran#hubungkan-ke-google-sheet" isExternal>README</Link>.
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" mb="1">Link web app (berakhiran /exec)</Text>
                    <Input fontSize="sm" inputMode="url" placeholder="https://script.google.com/macros/s/…/exec" value={url} onChange={(e) => setUrl(e.target.value)} />
                    <Text fontSize="sm" mt="3" color="gray.600" data-testid="sheet-state">{status}</Text>
                    {(error || syncError) && (
                        <Text fontSize="sm" mt="2" color="red.500" role="alert">
                            {error || `Gagal kirim: ${syncError}. Dicoba lagi otomatis saat online atau saat app dibuka.`}
                        </Text>
                    )}
                </ModalBody>
                <ModalFooter>
                    <HStack w="full">
                        {savedUrl && pending > 0 && (
                            <Button size="sm" variant="ghost" isLoading={sending} onClick={() => void flush()}>Kirim sekarang</Button>
                        )}
                        <Button ml="auto" colorScheme="green" isLoading={saving} onClick={() => void save()}>
                            {url.trim() ? 'Simpan link' : savedUrl ? 'Putuskan' : 'Simpan link'}
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
