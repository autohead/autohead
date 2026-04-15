import { useRef, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatDate, formatTime } from "../utils/datetimeUtils";
import IsLoadingDisplay from "../components/common/IsLoadingDisplay";
import IsErrorDisplay from "../components/common/IsErrorDisplay";
import { useDownloadInvoice } from "../hooks/billing";


interface BillItem {
    invoice_no: string;
    customer_name: string;
    created_at: string;
    items: {
        product_name: string;
        quantity: number;
        selling_price: number;
    }[];
    total_amount: number;
    discount: number;
    net_amount: number;
}

export default function InvoicePage() {
    const { id } = useParams();
    const location = useLocation();
    

    const [invoice, setInvoice] = useState<BillItem | null>(
        location.state?.billData || null
    );

    const downloadInvoice = location.state?.downloadInvoice || false;

    const { data: invoiceData, isLoading, isError } = useDownloadInvoice(String(id));
    // console.log("Invoice Data:", invoiceData);


    isLoading && <IsLoadingDisplay />;
    isError && IsErrorDisplay({ type: "Invoice" });

    const invoiceRef = useRef<HTMLDivElement>(null);

    
    // ✅ Fetch if opened via public URL
    useEffect(() => {
        if (!invoice && id) {
            setInvoice(invoiceData?.data || null);
        }
    }, [invoiceData, invoice]);

    // ✅ Auto download when coming from app
    useEffect(() => {
        if (downloadInvoice && invoice) {
            handleDownload();
        }
    }, [downloadInvoice, invoice]);

    const handleDownload = async () => {
        const element = invoiceRef.current;
        if (!element) return;

        element.style.transform = "scale(1)";
        element.style.transformOrigin = "top left";

        const canvas = await html2canvas(element, {
            scale: 1.5,
            backgroundColor: "#ffffff",
            useCORS: true,
        });


        const imgData = canvas.toDataURL("image/jpeg", 0.7);

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [80, 200],
            compress: true,
        });

        const imgWidth = 80;
        const pageHeight = 200;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // first page
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add extra pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`invoice-${invoice?.invoice_no}.pdf`);
    };

    if (!invoice && !invoiceData) return <IsLoadingDisplay />;


    return (
        <div>
            <div ref={invoiceRef} className="max-w-3xl mx-auto p-6 bg-white text-black my-10 border">

                {/* HEADER CARD */}
                <div className="border p-6 mb-6">
                    <div className="flex justify-between items-start">

                        <div>
                            <h2 className="text-xl font-semibold">
                                AutoHead Car Accessories
                            </h2>
                            <p className="text-sm mt-1">
                                Chalad, Alavil, Kannur
                            </p>
                            <p className="text-sm">
                                +91 90488 80789
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-xs uppercase">Invoice</p>
                            <p className="text-lg font-semibold">
                                #{invoice?.invoice_no}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between mt-6 text-sm">
                        <div>
                            <p>Customer</p>
                            <p className="font-medium">{invoice?.customer_name}</p>
                        </div>

                        <div className="text-right">
                            <p>Date</p>
                            <p>
                                {formatDate(invoice?.created_at || "")}
                            </p>
                            <p className="text-xs">
                                {formatTime(invoice?.created_at || "")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ITEMS */}
                <div className="border mb-6">

                    <div className="px-5 py-3 border-b text-sm font-medium">
                        Items
                    </div>

                    <div className="divide-y">
                        {invoice?.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center px-5 py-4">
                                <div>
                                    <p className="font-medium">{item.product_name}</p>
                                    <p className="text-xs">
                                        {item.quantity} × ₹{item.selling_price.toLocaleString()}
                                    </p>
                                </div>

                                <p className="font-semibold">
                                    ₹{(item.quantity * item.selling_price).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TOTAL CARD */}
                <div className="border p-5">

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{invoice?.net_amount.toLocaleString()}</span>
                        </div>

                        {invoice && invoice?.discount > 0 && (
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>- ₹{invoice?.discount.toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t mt-4 pt-4 flex justify-between items-center">
                        <span className="text-lg font-medium">Total</span>
                        <span className="text-2xl font-bold">
                            ₹{invoice?.total_amount.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="text-center mt-6 text-sm">
                    <p>Thank you for your purchase</p>
                    <p className="text-xs mt-1">Computer generated invoice</p>
                    <p className="text-xs mt-1">
                        Printed on: {new Date().toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </p>
                </div>

            </div>
            <div className="text-center mt-6">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={handleDownload}
                >
                    Download Invoice
                </button>
            </div>

        </div>


    );


}