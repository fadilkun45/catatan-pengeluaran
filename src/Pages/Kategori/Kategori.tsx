import { Box, Button, Divider, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, VStack, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { BoxList, ListKategori } from "./BoxList"


const KategoriListData: ListKategori[] = [
  {
    nama: "Makanan",
  },
  {
    nama: "Minuman",
  },
  {
    nama: "Jajan",
  }
]

const Kategori = () => {
  const [modalSubmit, setModalSubmit] = useState(false)
  const [modalSubmitSuccess, setModalSubmitSuccess] = useState(false)
  const { isOpen: modalConfirmDelete, onOpen: modalConfirmDeleteOpen, onClose: modalConfirmDeleteClose } = useDisclosure()
  const { isOpen: modalConfirmDeleteSuccess, onOpen: modalConfirmDeleteSuccessOpen, onClose: modalConfirmDeleteSuccessClose } = useDisclosure()


  return (
    <>
      <Modal isOpen={modalSubmit} onClose={() => setModalSubmit(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Kategori</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Anda yakin ingin menyimpan kategori berikut ?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='gray' mr={3} onClick={() => setModalSubmit(false)}>
              Batal
            </Button>
            <Button colorScheme="green" onClick={() => { setModalSubmit(false); setModalSubmitSuccess(true) }}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={modalSubmitSuccess} onClose={() => setModalSubmitSuccess(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Kategori</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Berhasil Menyimpan kategori</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={() => setModalSubmitSuccess(false)}>tutup</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={modalConfirmDelete} onClose={modalConfirmDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>hapus Kategori</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Anda yakin ingin menghapus kategori berikut ?</Text>
            <Text mt="7px" fontWeight="bold">Menghapus kategori tidak akan menghapus data yang terkait dengan kategori yang dihapus</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='gray' mr={3} onClick={modalConfirmDeleteClose}>
              Batal
            </Button>
            <Button colorScheme="green" onClick={() => {modalConfirmDeleteClose(); modalConfirmDeleteSuccessOpen() }}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={modalConfirmDeleteSuccess} onClose={modalConfirmDeleteSuccessOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hapus Kategori</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Berhasil Menghapus kategori</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={modalConfirmDeleteSuccessClose}>tutup</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VStack w={"full"}>
        <Text fontSize="18" w="full" mt="10px" fontWeight="bold" color="gray.600">Tambah Kategori</Text>
        <Divider  />
        <VStack w={"full"}>
          <Box w="full" mt="3">
            <Text mb="2" color="gray.600">Nama Kategori</Text>
            <Input fontSize="14px" variant='outline' placeholder='cth: jajan' />
          </Box>
          <Box w="full" mt="3">
            <Text mb="2" color="gray.600">Deskripsi Grup</Text>
            <Textarea fontSize="14px" variant='outline' placeholder='cth: jajan adalah kebutuhan hidup setelah sandang papan dan pangan' />
          </Box>
          <Button colorScheme="green" w="full" mt="3" onClick={() => setModalSubmit(true)}>submit</Button>
        </VStack>

        <VStack w="full" mt="10px">
        <Divider  />
        <Text fontSize="18" w="full" mt="10px" mb="14px" fontWeight="bold">List Kategori</Text>
        {
          KategoriListData.map((x,i) => (
            <BoxList onDelete={() => modalConfirmDeleteOpen()}  item={x} key={i} />
          ))
        }

        </VStack>

      </VStack>
    </>

  )
}

export default Kategori