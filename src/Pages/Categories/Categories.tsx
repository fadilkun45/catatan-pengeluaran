import { Box, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Switch, Text, Textarea, VStack, useDisclosure, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { BoxList, } from "./BoxList"
import { CategoriesLogType } from "../../Types/CategoriesLog"
import dayjs from "dayjs"
import { db } from "../../services/db/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useBookStore } from "../../store/BookStore"
import { HelperFunction } from "../../lib/HelperFunc"

const PRESET_COLORS = ["#48BB78", "#38B2AC", "#4299E1", "#667EEA", "#9F7AEA", "#ED64A6", "#F56565", "#ED8936", "#ECC94B", "#718096"]
const { textColorFor } = HelperFunction

const Categories = () => {
  const toast = useToast()
  const { isOpen: drawerAdd, onOpen: drawerAddOpen, onClose: drawerAddClose } = useDisclosure()
  const { isOpen: modalConfirmDelete, onOpen: modalConfirmDeleteOpen, onClose: modalConfirmDeleteClose } = useDisclosure()
  const { BookDetail } = useBookStore();

  const emptyCategory = (): CategoriesLogType => ({
    createdAt: dayjs().format("YYYY-MM-DD"),
    name: '',
    desc: '',
    labelColor: PRESET_COLORS[0],
    labelTextColor: textColorFor(PRESET_COLORS[0]),
    isSpecialCategories: false,
    bookId: BookDetail?.id || 'default'
  })

  const [detailDelete, setDetailDelete] = useState<CategoriesLogType>()
  const [newCategories, setNewCategories] = useState<CategoriesLogType>(emptyCategory)

  const itemsCategories = useLiveQuery(() => {
    const result = db.categoriesLog.toArray().then((items) => {
      if (BookDetail?.id !== 'default') {
        return items.filter((x) => x.bookId === BookDetail.id)
      }
      return items
    })
    return result
  }, [BookDetail])

  const openAdd = () => { setNewCategories(emptyCategory()); drawerAddOpen() }

  const handleAdd = async () => {
    if (!newCategories.name.trim()) {
      toast({ status: 'error', 'title': "nama wajib di isi", 'position': 'top-right' })
      return
    }
    try {
      await db.categoriesLog.add({ ...newCategories, name: newCategories.name.trim() })
      drawerAddClose()
      toast({ status: 'success', 'title': "kategori berhasil ditambah", 'position': 'top-right' })
    } catch (error) {
      toast({ status: 'error', 'title': "error log tambah categories", 'position': 'top-right' })
    }
  }

  const handleDelete = async () => {
    if (detailDelete?.id === undefined) return
    try {
      await db.categoriesLog.delete(detailDelete.id)
      modalConfirmDeleteClose()
      toast({ status: 'success', 'title': "kategori berhasil dihapus", 'position': 'top-right' })
    } catch (error) {
      toast({ status: 'error', 'title': "error log hapus categories", 'position': 'top-right' })
    }
  }

  const renderList = (special: boolean) => {
    const list = itemsCategories?.filter((x) => !!x.isSpecialCategories === special)
    if (list && !list.length) return <Text w="full" color="gray.500" fontSize="sm" mb="14px">Belum ada kategori</Text>
    return list?.map((x) => (
      <BoxList onDelete={() => { modalConfirmDeleteOpen(); setDetailDelete(x) }} item={x} key={x.id} />
    ))
  }

  return (
    <>
      <Modal isOpen={modalConfirmDelete} onClose={modalConfirmDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hapus Kategori</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Anda yakin ingin menghapus kategori <b>{detailDelete?.name}</b>?</Text>
            <Text mt="7px" fontWeight="bold">Menghapus kategori tidak akan menghapus data yang terkait</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='gray' mr={3} onClick={modalConfirmDeleteClose}>
              Batal
            </Button>
            <Button colorScheme="red" onClick={() => void handleDelete()}>Hapus</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer isOpen={drawerAdd} placement="bottom" onClose={drawerAddClose}>
        <DrawerOverlay />
        <DrawerContent maxW="container.sm" mx="auto" borderTopRadius="12px">
          <DrawerCloseButton />
          <DrawerHeader>Tambah Kategori</DrawerHeader>
          <DrawerBody>
            <VStack w="full" spacing="4">
              <Box w="full">
                <Text mb="2" color="gray.600">Nama Kategori</Text>
                <Input autoFocus fontSize="14px" value={newCategories.name} onChange={(v) => setNewCategories({ ...newCategories, name: v.target.value })} placeholder='cth: jajan' />
              </Box>

              <Box w="full">
                <Text mb="2" color="gray.600">Warna Label</Text>
                <HStack flexWrap="wrap" spacing="0" gap="2">
                  {PRESET_COLORS.map((c) => (
                    <Box
                      as="button"
                      key={c}
                      aria-label={`warna ${c}`}
                      w="36px" h="36px" borderRadius="full" bg={c}
                      outline={newCategories.labelColor === c ? "3px solid" : "none"}
                      outlineColor="gray.700" outlineOffset="2px"
                      onClick={() => setNewCategories({ ...newCategories, labelColor: c, labelTextColor: textColorFor(c) })}
                    />
                  ))}
                </HStack>
                <Box mt="3" bg={newCategories.labelColor} color={newCategories.labelTextColor} borderRadius="6px" py="3" textAlign="center" fontWeight="bold">
                  {newCategories.name || "Preview label"}
                </Box>
              </Box>

              <Box w="full">
                <HStack justify="space-between">
                  <Text color="gray.600">Kategori Spesial</Text>
                  <Switch colorScheme="green" isChecked={!!newCategories.isSpecialCategories} onChange={(v) => setNewCategories({ ...newCategories, isSpecialCategories: v.target.checked })} />
                </HStack>
                <Text color="gray.500" fontSize="small">Data kategori spesial tidak akan masuk kedalam total harian</Text>
              </Box>

              <Box w="full">
                <Text mb="2" color="gray.600">Deskripsi (opsional)</Text>
                <Textarea fontSize="14px" value={newCategories.desc} onChange={(v) => setNewCategories({ ...newCategories, desc: v.target.value })} placeholder='cth: jajan adalah kebutuhan hidup setelah sandang papan dan pangan' />
              </Box>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="green" w="full" onClick={() => void handleAdd()}>Simpan</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <VStack w={"full"}>
        <HStack w="full" mt="10px" justify="space-between">
          <Text fontSize="18" fontWeight="bold" color="gray.600">List Kategori</Text>
          <Button size="sm" colorScheme="green" onClick={openAdd}>+ Tambah</Button>
        </HStack>
        <Divider mb="14px" />
        {renderList(false)}

        <VStack w="full" mt="10px">
          <Divider />
          <Text fontSize="18" w="full" mt="10px" mb="14px" fontWeight="bold" color="gray.600">List Kategori Spesial</Text>
          {renderList(true)}
        </VStack>
      </VStack>
    </>
  )
}

export default Categories
