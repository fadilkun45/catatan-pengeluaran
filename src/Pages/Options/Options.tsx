/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Box, Button, Divider, HStack, Icon, IconButton, Input, theme as baseTheme, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, VStack, useDisclosure, useToast } from '@chakra-ui/react';
import { GoDownload } from 'react-icons/go';
import { ModalAlert } from '../../components/ModalAlert';
import { useEffect, useState } from 'react';
import { BsToggle2Off, BsToggleOn } from 'react-icons/bs';
import { FiAlertTriangle, FiBookOpen, FiCheck, FiEdit2, FiTrash, FiX } from 'react-icons/fi';
import { HelperFunction } from '../../lib/HelperFunc';
import { DEFAULT_BOOK, useBookStore } from '../../store/BookStore';
import { BookLogsType } from '../../Types/BookLogs';
import { THEMES, ThemeColor, useThemeStore } from '../../store/ThemeStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db/db';

const Options = () => {
	const { isOpen: modalConfirmLogout, onOpen: modalConfirmLogoutOpen, onClose: modalConfirmLogoutClose } = useDisclosure();
	const { isOpen: modalConfirmDownload, onOpen: modalConfirmDownloadOpen, onClose: modalConfirmDownloadClose } = useDisclosure();
	const { isOpen: modalAlertDownload, onOpen: modalAlertDownloadOpen, onClose: modalAlertDownloadClose } = useDisclosure();
	const { isOpen: modalConfirmToggleDetail, onOpen: modalConfirmToggleDetailOpen, onClose: modalConfirmToggleDetailClose } = useDisclosure();
	const { isOpen: modalAlertToggleDetail, onOpen: modalAlertToggleDetailOpen, onClose: modalAlertToggleDetailClose } = useDisclosure();
	const { isOpen: modalAlertLogout, onOpen: modalAlertLogoutOpen, onClose: modalAlertLogoutClose } = useDisclosure();
	const { isOpen: modalConfirmBook, onOpen: modalConfirmOpenBook, onClose: modalConfirmCloseBook } = useDisclosure();
	const [modalSettingLimit, setModalSettingLimit] = useState(false)
	const [modalSettingLimitAlert, setModalSettingLimitAlert] = useState(false)
	const [supportsPWA, setSupportsPWA] = useState(false);
	const [promptInstall, setPromptInstall] = useState<any>();
	const toast = useToast();
	const [toggleDetail, setToggleDetail] = useState(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_TOGGLE as string)) || false)
	const [limit, setLimit] = useState(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string)) || 0)

	const { BookDetail, setActiveBooks } = useBookStore();

	const bookOptions = useLiveQuery(() => {
		const result = db.books.toArray();
		return result;
	}, []);


	const [newBookName, setNewBookName] = useState('');
	const { color: themeColor, setColor: setThemeColor } = useThemeStore();
	const [editingBook, setEditingBook] = useState<BookLogsType | null>(null);
	const [deletingBook, setDeletingBook] = useState<BookLogsType | null>(null);

	useEffect(() => {
		const handler = (e: { preventDefault: () => void }) => {
			e.preventDefault();
			setSupportsPWA(true);
			setPromptInstall(e);
		};
		window.addEventListener('beforeinstallprompt', handler);
	}, []);

	const handleOnInstall = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		evt.preventDefault();
		if (!supportsPWA) {
			toast({
				title: 'Upss device mu tidak support PWA',
				position: 'top-right',
				isClosable: true,
				duration: 1000,
				colorScheme: 'yellow',
			});
			modalConfirmDownloadClose();
			modalAlertDownloadOpen();
			return;
		}

		if (!promptInstall) {
			modalConfirmDownloadClose();
			modalAlertDownloadOpen();
			return;
		}
		if (typeof promptInstall.prompt === 'function') {
			modalConfirmDownloadClose();
			modalAlertDownloadOpen();
			promptInstall.prompt();
		} else {
			modalConfirmDownloadClose();
			modalAlertDownloadOpen();
			console.error('Prompt to install is not available.');
		}
	};

	const handleEditToggle = () => {
		localStorage.setItem(import.meta.env.VITE_REACT_DEFAULT_TOGGLE as string, JSON.stringify(!toggleDetail || false))
		modalConfirmToggleDetailClose()
		modalAlertToggleDetailOpen()
	}

	const handleEditLimit = () => {
		setModalSettingLimit(false)
		localStorage.setItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string, JSON.stringify(limit))
		setModalSettingLimitAlert(true)
	}
	const handleNewBook = async () => {
		if (!newBookName.trim()) return toast({ title: 'Nama buku wajib diisi', status: 'warning', duration: 1500, position: 'top-right' });
		const newBook = {
			id: `book-${Date.now()}`,
			name: newBookName.trim(),
			createdAt: new Date().toISOString(),
		};

		try {
			// Simpan ke Dexie
			await db.books.add(newBook);

			// Update Zustand
			setActiveBooks(newBook);

			toast({ title: 'Buku baru ditambahkan!', status: 'success', duration: 1000, position: 'top-right' });
			setNewBookName('');
			modalConfirmCloseBook();
		} catch (error) {
			console.error('Gagal menambahkan buku:', error);
			toast({ title: 'Gagal menambahkan buku.', status: 'error' });
		}
	};

	const handleRenameBook = async () => {
		if (!editingBook) return;
		const name = editingBook.name.trim();
		if (!name) return toast({ title: 'Nama buku wajib diisi', status: 'warning', duration: 1500, position: 'top-right' });
		try {
			await db.books.update(editingBook.id, { name });
			// nama buku aktif disimpan terpisah di localStorage, jadi ikut diperbarui
			if (BookDetail?.id === editingBook.id) setActiveBooks({ ...BookDetail, name });
			setEditingBook(null);
		} catch (error) {
			toast({ title: 'Gagal mengganti nama buku.', status: 'error', position: 'top-right' });
		}
	};

	// Buku hanya bisa dihapus kalau tidak ada catatan pengeluaran di dalamnya, supaya tidak ada data yang hilang.
	const handleDeleteBook = async () => {
		if (!deletingBook) return;
		try {
			const deleted = await db.transaction('rw', [db.books, db.categoriesLog, db.pengeluaranLogs], async () => {
				if (await db.pengeluaranLogs.where('bookId').equals(deletingBook.id).count()) return false;
				await db.categoriesLog.where('bookId').equals(deletingBook.id).delete();
				await db.books.delete(deletingBook.id);
				return true;
			});
			if (!deleted) {
				toast({ title: `Buku "${deletingBook.name}" masih berisi catatan. Hapus catatannya dulu.`, status: 'warning', position: 'top-right' });
			} else {
				if (BookDetail?.id === deletingBook.id) setActiveBooks(DEFAULT_BOOK);
				toast({ title: 'Buku dihapus', status: 'success', duration: 1500, position: 'top-right' });
			}
			setDeletingBook(null);
		} catch (error) {
			toast({ title: 'Gagal menghapus buku.', status: 'error', position: 'top-right' });
		}
	};

	return (
		<>
			<ModalAlert modalClose={modalAlertLogoutClose} modalOpen={modalAlertLogout} title="sukses" subtitle="setings kategori berhasil" />

			<Modal isOpen={modalConfirmLogout} onClose={modalConfirmLogoutClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Logout</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Anda yakin ingin keluar ?</Text>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="gray" mr={3} onClick={modalConfirmLogoutClose}>
							Batal
						</Button>
						<Button
							colorScheme="green"
							onClick={() => {
								modalConfirmLogoutClose();
								modalAlertLogoutOpen();
							}}
						>
							Logout
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<ModalAlert modalClose={() => { modalAlertDownloadClose(); window.location.reload(); }} modalOpen={modalAlertDownload} title="sukses" subtitle="download app berhasil " />

			<Modal isOpen={modalConfirmDownload} onClose={modalConfirmDownloadClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Download App</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>dengan mendownload app ini anda dapat mencatat pengeluaran keuangan dimanapun kapanpun secara offline</Text>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="gray" mr={3} onClick={modalConfirmDownloadClose}>
							Batal
						</Button>

						<Button colorScheme="green" onClick={(evt) => handleOnInstall(evt)}>
							Download
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<ModalAlert modalClose={() => modalAlertToggleDetailClose()} modalOpen={modalAlertToggleDetail} title="sukses" subtitle={`Ubah default Detail menjadi ${toggleDetail ? 'Terbuka' : 'Tertutup'}`} />
			<Modal isOpen={modalConfirmToggleDetail} onClose={modalConfirmToggleDetailClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Ubah Default Detail</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Anda yakin ingin mengubah grup detail log pengeluaran per hari menjadi {toggleDetail ? "tertutup" : "terbuka"} secara default ? </Text>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="gray" mr={3} onClick={modalConfirmToggleDetailClose}>
							Batal
						</Button>

						<Button colorScheme="green" onClick={() => { setToggleDetail(!toggleDetail); handleEditToggle() }}>
							Iya
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<ModalAlert modalClose={() => setModalSettingLimitAlert(false)} modalOpen={modalSettingLimitAlert} title="sukses" subtitle={`Ubah default limit menjadi ${HelperFunction.FormatToRupiah(limit)}`} />
			<Modal isOpen={modalSettingLimit} onClose={() => setModalSettingLimit(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Tambah Limit</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Tambahkan Limit Pengeluaran Dalam 1 Hari</Text>
						<Input
							fontSize="sm"
							value={HelperFunction.FormatToRupiah2(limit)}
							onChange={(v: React.ChangeEvent<HTMLInputElement>) =>
								setLimit(Number.isNaN(parseInt(v.target.value)) ? 0 : parseInt(HelperFunction.onlyNumber(v.target.value)),)
							}
							mt="8px"
							w="full"
						/>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="gray" mr={3} onClick={() => { setLimit(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string))); setModalSettingLimit(false) }}>
							Batal
						</Button>
						<Button colorScheme="green" onClick={() => { handleEditLimit() }}>
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Modal isOpen={!!deletingBook} onClose={() => setDeletingBook(null)} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Hapus Buku</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Hapus buku <b>{deletingBook?.name}</b>? Kategori di buku ini ikut terhapus.</Text>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="gray" mr={3} onClick={() => setDeletingBook(null)}>Batal</Button>
						<Button colorScheme="red" onClick={() => void handleDeleteBook()}>Hapus</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Modal isOpen={modalConfirmBook} onClose={() => { setEditingBook(null); modalConfirmCloseBook(); }} size="md" isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Kelola Buku Catatan</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<VStack align="stretch" spacing={2}>
							<Text fontSize="sm" color="gray.600">Pilih buku catatan</Text>
							{bookOptions?.map((book) => {
								const active = BookDetail?.id === book.id;
								if (editingBook?.id === book.id) {
									return (
										<HStack key={book.id}>
											<Input
												autoFocus
												fontSize="sm"
												value={editingBook.name}
												onChange={(e) => setEditingBook({ ...editingBook, name: e.target.value })}
												onKeyDown={(e) => { if (e.key === 'Enter') void handleRenameBook(); if (e.key === 'Escape') setEditingBook(null); }}
											/>
											<IconButton aria-label="Simpan nama" icon={<FiCheck />} colorScheme="green" onClick={() => void handleRenameBook()} />
											<IconButton aria-label="Batal" icon={<FiX />} variant="ghost" onClick={() => setEditingBook(null)} />
										</HStack>
									);
								}
								return (
									<HStack
										key={book.id}
										pr={1}
										borderRadius="md"
										borderWidth={active ? 2 : 1}
										borderColor={active ? 'green.500' : 'gray.200'}
										bg={active ? 'green.50' : 'transparent'}
										_hover={{ bg: active ? 'green.50' : 'gray.50' }}
									>
										<HStack
											as="button"
											flex={1}
											px={4}
											py={3}
											textAlign="left"
											fontWeight={active ? 'bold' : 'normal'}
											onClick={() => {
												setActiveBooks(book);
												toast({ title: `Berhasil ganti ke ${book.name}`, status: 'success', duration: 1000, position: 'top-right' });
												modalConfirmCloseBook();
											}}
										>
											<Text fontSize="sm">{book.name}</Text>
											<Spacer />
											{active && <Icon as={FiCheck} color="green.500" />}
										</HStack>
										<IconButton aria-label={`Ganti nama ${book.name}`} icon={<FiEdit2 />} size="sm" variant="ghost" onClick={() => setEditingBook(book)} />
										{book.id !== DEFAULT_BOOK.id && (
											<IconButton aria-label={`Hapus ${book.name}`} icon={<FiTrash />} size="sm" variant="ghost" colorScheme="red" onClick={() => setDeletingBook(book)} />
										)}
									</HStack>
								);
							})}

							<Divider my={3} />

							<Text fontSize="sm" color="gray.600">Tambah buku baru</Text>
							<HStack>
								<Input
									placeholder="Nama buku baru"
									fontSize="sm"
									value={newBookName}
									onChange={(e) => setNewBookName(e.target.value)}
									onKeyDown={(e) => { if (e.key === 'Enter') void handleNewBook(); }}
								/>
								<Button colorScheme="green" flexShrink={0} onClick={() => void handleNewBook()}>
									Tambah
								</Button>
							</HStack>
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>


			<VStack w={'full'}>
				{/* <VStack w="full">
                    <Image src={Dummny} objectFit="cover" loading='eager' mx="auto" my="12px" w="150px" h="150px" border="1px solid" borderColor="green.400" rounded="full" />
                    <Text fontSize="xl" fontWeight="bold">Faldi Ramadhan</Text>
                </VStack> */}
				<VStack w="full" mt="10px" divider={<Divider />}>
					{supportsPWA && (
						<HStack w="full" px="12px" py="6px" onClick={modalConfirmDownloadOpen} cursor="pointer">
							<Text fontSize="sm">Download</Text>
							<Spacer />
							<Icon fontSize="18px" as={GoDownload} />
						</HStack>
					)}

					<HStack w="full" px="12px" py="6px" cursor="pointer" onClick={modalConfirmToggleDetailOpen}>
						<Text fontSize="sm">Buka Detail Secara Default</Text>
						<Spacer />
						<Icon fontSize="18px" as={toggleDetail ? BsToggleOn : BsToggle2Off} />
					</HStack>

					<HStack w="full" px="12px" py="6px" cursor="pointer" onClick={() => setModalSettingLimit(true)}>
						<Text fontSize="sm">Tambah Limit Pengeluaran Harian</Text>
						<Spacer />
						<Icon fontSize="18px" as={FiAlertTriangle} />
					</HStack>

					<HStack w="full" px="12px" py="6px" cursor="pointer" onClick={() => modalConfirmOpenBook()}>
						<Text fontSize="sm">Ganti / Tambah Buku</Text>
						<Spacer />
						<Icon fontSize="18px" as={FiBookOpen} />
					</HStack>

					<VStack w="full" px="12px" py="6px" align="stretch">
						<Text fontSize="sm">Warna Tema</Text>
						<HStack spacing={3} flexWrap="wrap">
							{(Object.keys(THEMES) as ThemeColor[]).map((c) => (
								<Box
									as="button"
									key={c}
									aria-label={`Tema ${THEMES[c]}`}
									title={THEMES[c]}
									w="32px"
									h="32px"
									rounded="full"
									bg={baseTheme.colors[c][500]}
									outline={themeColor === c ? '3px solid' : 'none'}
									outlineColor="gray.700"
									outlineOffset="2px"
									onClick={() => setThemeColor(c)}
								/>
							))}
						</HStack>
					</VStack>
				</VStack>

				<Text mt="40vh" fontSize="sm" color="gray.500">2024 &copy; Faldi Ramadhan</Text>
			</VStack>
		</>
	);
};

export default Options;
