import { Badge, Box, Button, Divider, HStack, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Textarea, VStack, useDisclosure } from "@chakra-ui/react"
import React from "react"


interface modalAlertProps {
    modalOpen: boolean,
    title: string,
    children?: React.ReactNode,
    subtitle?: string,
    modalClose: () => void,
}

export const ModalAlert = ({ modalOpen, title, children, subtitle, modalClose }: modalAlertProps) => {

    return (
        <Modal isOpen={modalOpen} onClose={() => modalClose()}>
            <ModalOverlay />
            <ModalContent>
                {
                    children ? children : <>
                        <ModalHeader>{title}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>{subtitle}</Text>
                        </ModalBody>
                    </>
                }
                <ModalFooter>
                    <Button colorScheme="green" onClick={() => modalClose()}>tutup</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
