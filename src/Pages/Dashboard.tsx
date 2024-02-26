import { Box, Button, Input, Select, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react'
import Chart from '../components/Chart'

export const Dashboard = () => {
  return (
    <VStack w="full" justifyContent="flex-start">
      <Text w="80%" my="12px" fontSize="16px">Pengeluaran hari ini :  <Text fontSize="32px">Rp.80.000</Text></Text>
      <Box display={"flex"} justifyContent='space-between' flexDirection={{ base: "column", 'md': 'row' }} w={{ base: "90%", 'md': "80%" }}>

        <Chart />
        <VStack w={{ base: "100%", md: "47%" }} mt={{ base: "15px", md: "-70px" }}>

          <Tabs w="full">
            <TabList>
              <Tab defaultChecked>Catatan</Tab>
              <Tab>Grup</Tab>
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

                <VStack mb="14px" w="98%" justifyContent="space-between">
                  <Text w="full" mb='8px'>Jumlah :</Text>
                  <Input
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

    </VStack>
  )
}
