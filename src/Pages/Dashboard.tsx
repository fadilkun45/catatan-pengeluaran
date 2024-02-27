import { Box, Button, Checkbox, HStack, Input, Select, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react'
import Chart from '../components/Chart'

export const Dashboard = () => {
  return (
    <VStack w="full" justifyContent="flex-start">
      <Text w="80%" my="12px" fontSize="16px">Pengeluaran hari ini :  <Text fontSize="32px" fontWeight="600">Rp.80.000</Text></Text>
      <Box display={"flex"} justifyContent='space-between' flexDirection={{ base: "column", 'md': 'row' }} w={{ base: "90%", 'md': "80%" }}>

        <Chart />
        <VStack w={{ base: "100%", md: "47%" }} mt={{ base: "15px", md: "-70px" }}>

          <Tabs w="full">
            <TabList>
              <Tab w="50%" defaultChecked>Catatan</Tab>
              <Tab w="50%" >Grup</Tab>
            </TabList>

            <TabPanels>

              <TabPanel>
                <Text w="full" mb='8px' fontSize="18px" fontWeight="bold">Tambah catatan baru</Text>

                <VStack mb="14px" w="98%" justifyContent="space-between">
                  <Text w="full" mb="12px">Pilih Grup</Text>
                  <Select>
                    <option value='option1' selected>sekalian buat grup baru</option>
                    <option value='option1' >12 Mei 2024</option>
                    <option value='option1'>grup baru</option>
                    <option value='option1'>grup baru lain nya</option>
                  </Select>
                </VStack>

                <VStack mb="14px" w="98%" justifyContent="space-between">
                  <Text w="full" mb='8px'>Nama :</Text>
                  <Input
                    // value={value}
                    // onChange={handleChange}
                    size='sm'
                  />
                </VStack>

                <VStack mb="14px" w="98%" justifyContent="space-between">
                  <Text w="full" mb='8px'>Jumlah :</Text>
                  <Input
                    // value={value}
                    // onChange={handleChange}
                    size='sm'
                  />
                </VStack>

                <Button colorScheme='blue'>Submit</Button>
              </TabPanel>

              <TabPanel>

                <Text w="full" mb='8px' fontSize="18px" fontWeight="bold">Tambah Grup baru</Text>

                <VStack mb="14px" w="98%" justifyContent="space-between">
                  <Text w="full" mb='8px'>Nama :</Text>
                  <Input
                    // value={value}
                    // onChange={handleChange}
                    size='sm'
                  />
                </VStack>

                <HStack mb="14px" w="98%" justifyContent="space-between">
                  <Checkbox
                    // value={value}
                    // onChange={handleChange}
                    size='sm'
                  />
                  <Text w="full" mb='8px'>grup pengeluaran general hari ini</Text>
                </HStack>

                <VStack mb="14px" w="98%" justifyContent="space-between">
                  <Text w="full" mb='8px'>Limit :</Text>
                  <Input
                    // value={value}
                    // onChange={handleChange}
                    size='sm'
                  />
                </VStack>

                <VStack mb="14px" w="98%" justifyContent="space-between">
                  <Text w="full" mb='8px'>tanggal akhir grup :</Text>
                  <Input
                    type='date'
                    // value={value}
                    // onChange={handleChange}
                    size='sm'
                  />
                </VStack>

                <Button colorScheme='blue'>create</Button>

              </TabPanel>

            </TabPanels>
          </Tabs>



        </VStack>
      </Box>

      <Text w="80%" my="12px" fontSize="19px">Grup terbaru</Text>
      <Box display={"flex"} justifyContent='space-between' flexWrap='wrap'  flexDirection={{ base: "column", 'md': 'row' }} w={{ base: "90%", 'md': "80%" }}>

        <VStack w={{ base: "100%", md: "49%" }} py="16px" px="17px" background="gray.100" borderRadius="8px" mb="18px">
          <Text width="full" fontSize="18px">Rabu 19 Januari 2024</Text>
          <Text width="full" fontSize="14px" mt="-6px">tgl akhir: 22 januari 2024</Text>
          <Text width="full" fontSize="16px" display="flex">Total: <Text ml="4px" fontWeight="600">Rp. 30.000.000</Text></Text>
          <Text width="full" fontSize="16px" display="flex">Limit: <Text ml="4px" fontWeight="600">Rp. 30.000.000</Text></Text>
          <Text width="full" fontSize="16px" fontWeight="600">Rp. 15.000.000 dari Rp.30.000.000 | 50% </Text>

          <HStack w="full" mt="12px">
            <Button size="sm" colorScheme='blue'>Edit</Button>
            <Button size="sm" colorScheme='red'>Delete</Button>
          </HStack>
        </VStack>

        <VStack w={{ base: "100%", md: "49%" }} py="16px" px="17px" background="gray.100" borderRadius="8px" mb="18px">
          <Text width="full" fontSize="18px">Rabu 19 Januari 2024</Text>
          <Text width="full" fontSize="14px" mt="-6px">tgl akhir: 22 januari 2024</Text>
          <Text width="full" fontSize="16px" display="flex">Total: <Text ml="4px" fontWeight="600">Rp. 30.000.000</Text></Text>
          <Text width="full" fontSize="16px" display="flex">Limit: <Text ml="4px" fontWeight="600">Rp. 30.000.000</Text></Text>
          <Text width="full" fontSize="16px" fontWeight="600">Rp. 15.000.000 dari Rp.30.000.000 | 50% </Text>

          <HStack w="full" mt="12px">
            <Button size="sm" colorScheme='blue'>Edit</Button>
            <Button size="sm" colorScheme='red'>Delete</Button>
          </HStack>
        </VStack>

        <VStack w={{ base: "100%", md: "49%" }} py="16px" px="17px" background="gray.100" borderRadius="8px" mb="18px">
          <Text width="full" fontSize="18px">Rabu 19 Januari 2024</Text>
          <Text width="full" fontSize="14px" mt="-6px">tgl akhir: 22 januari 2024</Text>
          <Text width="full" fontSize="16px" display="flex">Total: <Text ml="4px" fontWeight="600">Rp. 30.000.000</Text></Text>
          <Text width="full" fontSize="16px" display="flex">Limit: <Text ml="4px" fontWeight="600">Rp. 30.000.000</Text></Text>
          <Text width="full" fontSize="16px" fontWeight="600">Rp. 15.000.000 dari Rp.30.000.000 | 50% </Text>

          <HStack w="full" mt="12px">
            <Button size="sm" colorScheme='blue'>Edit</Button>
            <Button size="sm" colorScheme='red'>Delete</Button>
          </HStack>
        </VStack>

      </Box>

    </VStack>
  )
}
