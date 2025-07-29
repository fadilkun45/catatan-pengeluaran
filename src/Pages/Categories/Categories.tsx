import { Box, Button, Checkbox, Divider, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, VStack, useDisclosure, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { BoxList, } from "./BoxList"
import { CategoriesLogType } from "../../Types/CategoriesLog"
import dayjs from "dayjs"
import { db } from "../../services/db/db"
import { useLiveQuery } from "dexie-react-hooks"
import { HexColorPicker } from "react-colorful"
import { useBookStore } from "../../store/BookStore"

const Categories = () => {
  const toast = useToast()
  const [modalSubmit, setModalSubmit] = useState(false)
  const [modalSubmitSuccess, setModalSubmitSuccess] = useState(false)
  const { isOpen: modalConfirmDelete, onOpen: modalConfirmDeleteOpen, onClose: modalConfirmDeleteClose } = useDisclosure()
  const { isOpen: modalConfirmDeleteSuccess, onOpen: modalConfirmDeleteSuccessOpen, onClose: modalConfirmDeleteSuccessClose } = useDisclosure()
  const { isOpen: modalColor, onOpen: modalColorOpen, onClose: modalColorClose } = useDisclosure()
  const { BookDetail } = useBookStore();

  const [detailDelete, setDetailDelete] = useState<CategoriesLogType>()
  const [newCategories, setNewCategories] = useState<CategoriesLogType>({
    createdAt: dayjs().format("YYYY-MM-DD"),
    name: '',
    desc: '',
    labelColor: '',
    labelTextColor: '',
    isSpecialCategories: false,
    bookId: BookDetail?.id || 'default'
  })
  const [color, setColor] = useState("");
  const [colorText, setColorText] = useState("");

  const itemsCategories = useLiveQuery(() => {
    const result = db.categoriesLog.toArray().then((items) => {
      if (BookDetail?.id !== 'default') {
        return items.filter((x) => x.bookId === BookDetail.id)
      }
      return items
    })
    return result
  }, [BookDetail])


  const handleAdd = () => {
    if (!color || !newCategories.name || !colorText) {
      if (!newCategories.name) {
        toast({
          'colorScheme': "red",
          'title': "nama wajib di isi",
          'position': 'top-right'
        })
      }
      if (!color) {
        toast({
          'colorScheme': "red",
          'title': "warna label dan text wajib di isi",
          'position': 'top-right'
        })
      }
      return
    }
    try {
      void db.categoriesLog.add({ ...newCategories, labelColor: color, labelTextColor: colorText })
      setModalSubmit(false); setModalSubmitSuccess(true)
      setNewCategories({
        createdAt: dayjs().format("YYYY-MM-DD"),
        name: '',
        desc: '',
        labelColor: '',
        labelTextColor: '',
        bookId: BookDetail?.id || 'default'
      })
      setColor('')
      setColorText('')
    } catch (error) {
      toast({
        'colorScheme': "red",
        'title': "error log tambah categories",
        'position': 'top-right'
      })
    }
  }

  const handleDelete = () => {
    try {
      void db.categoriesLog.delete(detailDelete?.id)
      modalConfirmDeleteClose()
      modalConfirmDeleteSuccessOpen()
    } catch (error) {
      toast({
        'colorScheme': "red",
        'title': "error log hapus categories",
        'position': 'top-right'
      })
    }
  }


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
            <Button colorScheme="green" onClick={handleAdd}>Submit</Button>
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
            <Text mt="7px" fontWeight="bold">Menghapus kategori tidak akan menghapus data yang terkait</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='gray' mr={3} onClick={modalConfirmDeleteClose}>
              Batal
            </Button>
            <Button colorScheme="green" onClick={handleDelete}>Submit</Button>
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

      <Modal isOpen={modalColor} onClose={modalColorClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>pilih Warna Label dan text</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb="3" >
              <Text mb="2" color="gray.600">Label background</Text>
              <HexColorPicker style={{ width: "100%" }} color={color} onChange={setColor} />
            </Box>
            <Text mb="2" color="gray.600">Text</Text>
            <HexColorPicker style={{ width: "100%" }} color={colorText} onChange={setColorText} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={modalColorClose}>tutup</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VStack w={"full"}>
        <Text fontSize="18" w="full" mt="10px" fontWeight="bold" color="gray.600">Tambah Kategori</Text>
        <Divider />
        <VStack w={"full"}>
          <Box w="full" mt="3">
            <Text mb="2" color="gray.600">Nama Kategori</Text>
            <Input fontSize="14px" value={newCategories.name} onChange={(v) => setNewCategories({ ...newCategories, name: v.target.value })} variant='outline' placeholder='cth: jajan' />
          </Box>
          <Box w="full" mt="3">
            <Text mb="2" color="gray.600">Deskripsi Kategori</Text>
            <Textarea fontSize="14px" value={newCategories.desc} onChange={(v) => setNewCategories({ ...newCategories, desc: v.target.value })} variant='outline' placeholder='cth: jajan adalah kebutuhan hidup setelah sandang papan dan pangan' />
          </Box>
          <HStack w="full" mt="3" display="flex" flexDirection="column">
            <HStack w="full">
              <Text mb="2" color="gray.600">Kategori Spesial</Text>
              <Checkbox fontSize="14px" marginTop="-4px" colorScheme={"green"} checked={newCategories.isSpecialCategories} onChange={(v) => setNewCategories({ ...newCategories, isSpecialCategories: v.target.checked ? true : false })} variant='outline' />
            </HStack>
            <Text w="full" mb="2" color="gray.600" fontSize="small">Data kategori spesial tidak akan masuk kedalam total harian</Text>
          </HStack>
          <Box w="full" mt="3">
            <Text mb="2" color="gray.600">Warna background dan text label</Text>
            <Box backgroundColor={color} w={"full"} cursor={"pointer"} justifyContent="center" display="flex" alignItems="center" onClick={modalColorOpen} height={"3rem"} border="1px solid gray" borderRadius="6px" >
              <Text color={colorText} fontSize={"14px"} textAlign="center" > {newCategories.name || "Click Untuk Ganti Warna"}</Text>
            </Box>
          </Box>
          <Button colorScheme="green" w="full" mt="3" onClick={() => setModalSubmit(true)}>submit</Button>
        </VStack>

        <VStack w="full" mt="10px">
          <Divider />
          <Text fontSize="18" w="full" mt="10px" mb="14px" fontWeight="bold">List Kategori</Text>
          {
            itemsCategories?.filter((x) => !x.isSpecialCategories)?.map((x, i) => (
              <BoxList onDelete={() => { modalConfirmDeleteOpen(); setDetailDelete(x) }} item={x} key={i} />
            ))
          }

        </VStack>

        <VStack w="full" mt="10px">
          <Divider />
          <Text fontSize="18" w="full" mt="10px" mb="14px" fontWeight="bold">List Kategori Spesial</Text>
          {
            itemsCategories?.filter((x) => x.isSpecialCategories)?.map((x, i) => (
              <BoxList onDelete={() => { modalConfirmDeleteOpen(); setDetailDelete(x) }} item={x} key={i} />
            ))
          }

        </VStack>

      </VStack>
    </>

  )
}

export default Categories