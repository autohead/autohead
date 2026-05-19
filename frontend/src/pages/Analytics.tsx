
import { useState } from 'react';
import { FormField, Input, Select } from '../components/FormField';


export default function Analytics() {

    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: new Date().toISOString().split('T')[0], // default to today
        transactionType: '',
    });

    return (
        <div className="p-4 lg:p-6">

            <div className="mb-6">

                <div className="bg-card rounded-xl p-4 lg:p-5 border border-border shadow-sm mb-6">
                    <div className={"grid grid-cols-1 md:grid-cols-4 gap-5"}>

                        {/* Date Input */}
                        <FormField label="From Date" required error={""}>
                            <Input
                                type="date"
                                value={formData.fromDate}
                                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                                max={new Date().toISOString().split("T")[0]} // prevent future dates
                            />
                        </FormField>


                        <FormField label="To Date" required error={""}>
                            <Input
                                type="date"
                                value={formData.toDate}
                                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                                max={new Date().toISOString().split("T")[0]} // prevent future dates
                            />
                        </FormField>



                        <FormField label="Transaction Type" required error={""}>
                            <Select
                                options={[
                                    { value: 'INCOME', label: 'INCOME' },
                                    { value: 'EXPENSE', label: 'EXPENSE' },
                                ]}
                                value={formData.transactionType}
                                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                            />
                        </FormField>


                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">

                            <button
                                type="submit"
                                className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            >
                                Generate Report

                            </button>
                        </div>


                    </div>



                </div>

                <div className="bg-card rounded-xl p-4 lg:p-5 border border-border shadow-sm mb-6">
                    <div className="hidden lg:block bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm text-muted-foreground">Item</th>
                                        <th className="px-4 py-3 text-left text-sm text-muted-foreground">Qty</th>
                                        <th className="px-4 py-3 text-left text-sm text-muted-foreground">Cost</th>
                                        <th className="px-4 py-3 text-left text-sm text-muted-foreground">Date</th>
                                        <th className="px-4 py-3 text-left text-sm text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}