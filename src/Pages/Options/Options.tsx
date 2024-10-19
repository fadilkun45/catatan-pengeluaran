/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Box, Button, Divider, HStack, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Textarea, VStack, useDisclosure, useToast } from '@chakra-ui/react';
import { IoExitOutline, IoInformation } from 'react-icons/io5';
import { GoDownload } from 'react-icons/go';
import { ModalAlert } from '../../components/ModalAlert';
import { useEffect, useState } from 'react';
import { BsToggle2Off, BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { FiAlertTriangle } from 'react-icons/fi';
import { HelperFunction } from '../../lib/HelperFunc';

const Options = () => {
	const { isOpen: modalConfirmLogout, onOpen: modalConfirmLogoutOpen, onClose: modalConfirmLogoutClose } = useDisclosure();
	const { isOpen: modalConfirmDownload, onOpen: modalConfirmDownloadOpen, onClose: modalConfirmDownloadClose } = useDisclosure();
	const { isOpen: modalAlertDownload, onOpen: modalAlertDownloadOpen, onClose: modalAlertDownloadClose } = useDisclosure();
    const { isOpen: modalConfirmToggleDetail, onOpen: modalConfirmToggleDetailOpen, onClose: modalConfirmToggleDetailClose } = useDisclosure();
	const { isOpen: modalAlertToggleDetail, onOpen: modalAlertToggleDetailOpen, onClose: modalAlertToggleDetailClose } = useDisclosure();
	const { isOpen: modalAlertLogout, onOpen: modalAlertLogoutOpen, onClose: modalAlertLogoutClose } = useDisclosure();
    const [modalSettingLimit, setModalSettingLimit] = useState(false)
    const [modalSettingLimitAlert, setModalSettingLimitAlert] = useState(false)
	const [supportsPWA, setSupportsPWA] = useState(false);
	const [promptInstall, setPromptInstall] = useState<any>();
	const toast = useToast();
    const [toggleDetail, setToggleDetail] = useState(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_TOGGLE as string)) || false)
    const [limit, setLimit] = useState(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string)) || 0)

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

			<ModalAlert modalClose={() => {modalAlertDownloadClose();window.location.reload();}} modalOpen={modalAlertDownload} title="sukses" subtitle="download app berhasil " />
		
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

            <ModalAlert modalClose={() => {modalAlertDownloadClose();window.location.reload();}} modalOpen={modalAlertDownload} title="sukses" subtitle="download app berhasil " />
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
			<Modal isOpen={modalConfirmToggleDetail} onClose={modalAlertToggleDetailClose}>
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

						<Button colorScheme="green" onClick={() => {setToggleDetail(!toggleDetail);handleEditToggle()}}>
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
						<Button colorScheme="gray" mr={3} onClick={() => {setLimit(JSON.parse(localStorage.getItem(import.meta.env.VITE_REACT_DEFAULT_LIMIT as string)));setModalSettingLimit(false)}}>
							Batal
						</Button>
						<Button colorScheme="green" onClick={() => {handleEditLimit()}}>
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<VStack w={'full'}>
				{/* <VStack w="full">
                    <Image src={Dummny} objectFit="cover" loading='eager' mx="auto" my="12px" w="150px" h="150px" border="1px solid" borderColor="green.400" rounded="full" />
                    <Text fontSize="xl" fontWeight="bold">Faldi Ramadhan</Text>
                </VStack> */}
				<Divider />
				<VStack w="full">
					{supportsPWA && (
						<HStack w="full" px="12px" py="6px" onClick={modalConfirmDownloadOpen} cursor="pointer">
							<Text fontSize="sm">Download</Text>
							<Spacer />
							<Icon fontSize="18px" as={GoDownload} />
						</HStack>
					)}

					<Divider />

					<HStack w="full" px="12px" py="6px" onClick={modalConfirmToggleDetailOpen}>
						<Text fontSize="sm">Buka Detail Secara Default</Text>
						<Spacer />
						<Icon fontSize="18px" as={toggleDetail ? BsToggleOn : BsToggle2Off} />
					</HStack>
					<Divider />

                    <HStack w="full" px="12px" py="6px" onClick={() => setModalSettingLimit(true)}>
						<Text fontSize="sm">Tambah Limit Pengeluaran Harian</Text>
						<Spacer />
						<Icon fontSize="18px" as={FiAlertTriangle} />
					</HStack>

					{/* <HStack w="full" px="12px" cursor="pointer" py="6px" onClick={modalConfirmLogoutOpen}>
                        <Text fontSize="sm">Logout</Text>
                        <Spacer />
                        <Icon fontSize="18px" as={IoExitOutline} />
                    </HStack>
                    <Divider /> */}

					<Text mt="40vh">2024 &copy; Faldi Ramadhan</Text>
				</VStack>
			</VStack>
		</>
	);
};

export default Options;
