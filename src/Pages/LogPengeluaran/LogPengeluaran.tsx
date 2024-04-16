import { Badge, Box, Button, Divider, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Textarea, VStack, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import ReactSelect from "react-select"
import LineChart from "../../components/LineChart"

const LogPengeluaran = () => {

    const [kategori, setKategori] = useState([
        { value: 1, label: "jajan" },
        { value: 2, label: "makanan" },
        { value: 3, label: "minuman" },

    ])

    const handleSelectKategori = (evt: any) => {
        console.log("kat", evt)
    }

    return (
        <>

            <VStack w={"full"}>
                <VStack w="full">
                    <Text w="full" fontSize="lg" fontWeight="bold">Pilih Range waktu</Text>
                    <HStack w="full" mb="13px">
                        <Box w="49%" >
                            <Text mb="4px" fontSize="sm">Tanggal Awal</Text>
                            <Input type="date" />
                        </Box>
                        <Box w="49%">
                            <Text mb="4px" fontSize="sm"> Tanggal Akhir</Text>
                            <Input type="date" />
                        </Box>
                    </HStack>
                </VStack>

                <VStack w="full">
                    <Text w="full" fontSize="lg" fontWeight="bold">Kategori</Text>
                    <Box w="full">
                        <ReactSelect
                            isMulti
                            name="colors"
                            options={kategori}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleSelectKategori}
                        />
                    </Box>
                </VStack>

                <Box w={"90%"} height={"50vh"} mb="8px">
                    <LineChart />
                </Box>

                    <HStack w="full">
                        <VStack background="green.400" color="white" px="6px" borderRadius="6px" py="6px">
                            <Text fontSize="29px" fontWeight="bold">6111</Text>
                            <Text fontSize="md" >Catatan</Text>
                        </VStack>
                        <VStack background="green.400"  flex="2" color="white" px="6px" borderRadius="6px" py="6px">
                            <Text w="95%" fontSize="29px" fontWeight="bold">75.000</Text>
                            <Text  w="95%" fontSize="md" >Total transaksi</Text>
                        </VStack>
                    </HStack>

                <VStack w="full" mt="10px">
                    <Divider />
                    <VStack mb="10px" w="full">
                        <HStack mb="9px" w="full" alignItems="start" px="20px" py="6px" borderRadius="8px" background="green.400" color="white">
                            <Box >
                                <Text fontSize="29px" fontWeight="bold">20</Text>
                                <Text fontSize="16px" >Januari, 2024</Text>
                            </Box>
                            <Spacer />
                            <Box >
                                <Text fontSize="20px" fontWeight="bold">Rp.25.000</Text>
                            </Box>
                        </HStack>

                        <VStack w="full" alignItems="start" px="20px" py="12px" borderRadius="8px" background="green.500" color="white">
                            <HStack w="full">
                                <Text fontSize={"16px"}>jajan gorengan</Text>
                                <Spacer />
                                <Text fontSize={"16px"}>Rp.20.000</Text>
                            </HStack>
                            <HStack w="full">
                                <Badge px="3" py="3px" rounded="full" >Jajan</Badge>
                                <Badge px="3" py="3px" rounded="full" >Makanan</Badge>
                            </HStack>
                        </VStack>

                        <VStack w="full" alignItems="start" px="20px" py="12px" borderRadius="8px" background="green.500" color="white">
                            <HStack w="full">
                                <Text fontSize={"16px"}>Beli air</Text>
                                <Spacer />
                                <Text fontSize={"16px"}>Rp.5.000</Text>
                            </HStack>
                            <HStack w="full">
                                <Badge px="3" py="3px" rounded="full" >Jajan</Badge>
                                <Badge px="3" py="3px" rounded="full" >Minuman</Badge>
                            </HStack>
                        </VStack>

                    </VStack>

                    <VStack mb="10px" w="full">
                        <HStack mb="9px" w="full" alignItems="start" px="20px" py="6px" borderRadius="8px" background="green.400" color="white">
                            <Box >
                                <Text fontSize="29px" fontWeight="bold">19</Text>
                                <Text fontSize="16px" >Januari, 2024</Text>
                            </Box>
                            <Spacer />
                            <Box >
                                <Text fontSize="20px" fontWeight="bold">Rp.25.000</Text>
                            </Box>
                        </HStack>

                        <VStack w="full" alignItems="start" px="20px" py="12px" borderRadius="8px" background="green.500" color="white">
                            <HStack w="full">
                                <Text fontSize={"16px"}>jajan gorengan</Text>
                                <Spacer />
                                <Text fontSize={"16px"}>Rp.20.000</Text>
                            </HStack>
                            <HStack w="full">
                                <Badge px="3" py="3px" rounded="full" >Jajan</Badge>
                                <Badge px="3" py="3px" rounded="full" >Makanan</Badge>
                            </HStack>
                        </VStack>

                        <VStack w="full" alignItems="start" px="20px" py="12px" borderRadius="8px" background="green.500" color="white">
                            <HStack w="full">
                                <Text fontSize={"16px"}>Beli air</Text>
                                <Spacer />
                                <Text fontSize={"16px"}>Rp.5.000</Text>
                            </HStack>
                            <HStack w="full">
                                <Badge px="3" py="3px" rounded="full" >Jajan</Badge>
                                <Badge px="3" py="3px" rounded="full" >Minuman</Badge>
                            </HStack>
                        </VStack>

                    </VStack>

                    <VStack mb="10px" w="full">
                        <HStack mb="9px" w="full" alignItems="start" px="20px" py="6px" borderRadius="8px" background="green.400" color="white">
                            <Box >
                                <Text fontSize="29px" fontWeight="bold">18</Text>
                                <Text fontSize="16px" >Januari, 2024</Text>
                            </Box>
                            <Spacer />
                            <Box >
                                <Text fontSize="20px" fontWeight="bold">Rp.25.000</Text>
                            </Box>
                        </HStack>

                        <VStack w="full" alignItems="start" px="20px" py="12px" borderRadius="8px" background="green.500" color="white">
                            <HStack w="full">
                                <Text fontSize={"16px"}>jajan gorengan</Text>
                                <Spacer />
                                <Text fontSize={"16px"}>Rp.20.000</Text>
                            </HStack>
                            <HStack w="full">
                                <Badge px="3" py="3px" rounded="full" >Jajan</Badge>
                                <Badge px="3" py="3px" rounded="full" >Makanan</Badge>
                            </HStack>
                        </VStack>

                        <VStack w="full" alignItems="start" px="20px" py="12px" borderRadius="8px" background="green.500" color="white">
                            <HStack w="full">
                                <Text fontSize={"16px"}>Beli air</Text>
                                <Spacer />
                                <Text fontSize={"16px"}>Rp.5.000</Text>
                            </HStack>
                            <HStack w="full">
                                <Badge px="3" py="3px" rounded="full" >Jajan</Badge>
                                <Badge px="3" py="3px" rounded="full" >Minuman</Badge>
                            </HStack>
                        </VStack>

                    </VStack>

                </VStack>

            </VStack>
        </>
    )
}

export default LogPengeluaran