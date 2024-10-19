import { Badge, Button, HStack, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, VStack, useDisclosure, useToast } from '@chakra-ui/react';
import { HelperFunction } from '../lib/HelperFunc';
import { PengeluaranLogType } from '../Types/PengeluaranLog';
import { BiX } from 'react-icons/bi';
import { db } from '../services/db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';

export const DetailLog = ({ item }: { item: PengeluaranLogType }) => {
  const { isOpen: modalConfirm, onOpen: modalConfirmOpen, onClose: modalConfirmClose } = useDisclosure();
  const toast = useToast();

  const categories = useLiveQuery(() => {
    const result = db.categoriesLog.toArray();
    return result;
  }, []);

  const handleAdd = () => {
    try {
      void db.pengeluaranLogs.delete(item.id);
      modalConfirmClose();
      toast({
        colorScheme: 'green',
        title: 'Hapus log pengeluaran berhasil',
        position: 'top-right',
      });
    } catch (error) {
      toast({
        colorScheme: 'red',
        title: 'error log hapus pengeluaran',
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <Modal isOpen={modalConfirm} onClose={() => modalConfirmClose()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hapus Log</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Anda yakin ingin menyimpan kategori berikut ?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={() => modalConfirmClose()}>
              Tidak
            </Button>
            <Button colorScheme="green" onClick={() => void handleAdd()}>
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VStack w="full" alignItems="start" px="20px" py="12px" borderRadius="8px" background="green.500" color="white">
        <HStack w="full">
          <Text fontSize={'16px'}>{item.name}</Text>
          <Spacer />
          <Text fontSize={'16px'}>{HelperFunction.FormatToRupiah(item.amount)}</Text>
        </HStack>
        <HStack w="full" display="flex">
          <HStack wrap={"wrap"} >
          {
               item.categoriesId?.map((x) => {
              const categorieSelected = categories?.filter(categorie => categorie.id === x)[0]
              if (categorieSelected?.name) {
                return <Badge px="3" py="3px" color={categorieSelected?.labelTextColor} background={categorieSelected?.labelColor} rounded="full" >{categorieSelected?.name}</Badge>
              }
            })
          }
          </HStack>
          <Spacer />
            <Button size="sm" rounded="6px" h="30px" onClick={modalConfirmOpen}>
              <Icon as={BiX} />
            </Button>
        </HStack>
      </VStack>
    </>
  );
};
