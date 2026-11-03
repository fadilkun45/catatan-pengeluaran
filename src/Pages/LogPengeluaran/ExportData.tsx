import { Button, useToast } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

export const ExportData = ({ setLoading, items, date, informationDetail }: { setLoading: (parms: boolean) => void, items: any, date: { lastDate: string, firstDate: string }, informationDetail: any }) => {
  const toast = useToast();

  
  const exportData = () => {
    if (!items || !informationDetail.totalAmount){
      toast({
        title: 'Tidak ada data untuk diekspor',
        status: 'warning',
        duration: 3000, 
        isClosable: true,
        position: 'top-right',
      });
      return
    }
    setLoading(true);

    const wsData = [['Catatan Pengeluaran'], ['periode', `${dayjs(date.firstDate).format('DD/MM/YYYY')} - ${dayjs(date.lastDate).format('DD/MM/YYYY')}`], ['Tanggal', 'Nama', 'Jumlah'], ...items.map((item: { createdAt: string; name: string; amount: number; }) => [item.createdAt, item.name, item.amount])];

    // Real numbers (not "12.000" text) so the column can be summed and pivoted in Excel.
    wsData.push(['Total', '', informationDetail?.totalAmount as number]);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
    for (let r = 3; r < wsData.length; r++) ws[XLSX.utils.encode_cell({ r, c: 2 })].z = '#,##0';

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pengeluaran');

    XLSX.writeFile(wb, `catatan pengeluaran ${dayjs(date.firstDate).format('DD-MM-YYYY')} sd ${dayjs(date.lastDate).format('DD-MM-YYYY')}.xlsx`);

    setLoading(false);
  };

  return (
    <Button width="full " border="1px solid green" bg={'transparent'} mb="10px" onClick={() => exportData()}>
      Export as Excel
    </Button>
  )
}
