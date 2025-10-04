import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Upload, Loader2, Scan, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchCurrencies } from '@/constants/countries';
import { processReceipt } from '@/lib/ocrUtils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export const CreateExpenseDialog = ({ onExpenseCreated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scannedData, setScannedData] = useState(null);
    const [newExpense, setNewExpense] = useState({
        description: '',
        expenseDate: '',
        category: '',
        paidBy: '',
        totalAmount: '',
        currencySelection: 'USD',
        remarks: '',
    });

    const categories = ['Food', 'Transport', 'Accommodation', 'Supplies', 'Other'];

    // Fetch currencies when dialog opens
    useEffect(() => {
        if (isOpen) {
            loadCurrencies();
        }
    }, [isOpen]);

    const loadCurrencies = async () => {
        setIsLoadingCurrencies(true);
        const currencyData = await fetchCurrencies();
        setCurrencies(currencyData);
        setIsLoadingCurrencies(false);
    };

    const handleInputChange = (field, value) => {
        setNewExpense((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            
            // Check if it's an image file for OCR processing
            if (selectedFile.type.startsWith('image/')) {
                setIsScanning(true);
                setScanProgress(0);
                toast.info('Scanning receipt...', {
                    description: 'Please wait while we extract the data',
                });

                try {
                    const result = await processReceipt(selectedFile, (progress) => {
                        setScanProgress(Math.round(progress * 100));
                    });

                    if (result.success && result.data) {
                        setScannedData(result.data);
                        
                        // Auto-fill form with scanned data
                        const updates = {};
                        if (result.data.amount) {
                            updates.totalAmount = result.data.amount;
                        }
                        if (result.data.currency) {
                            updates.currencySelection = result.data.currency;
                        }
                        if (result.data.date) {
                            // Try to convert date to YYYY-MM-DD format
                            try {
                                const parsedDate = new Date(result.data.date);
                                if (!isNaN(parsedDate.getTime())) {
                                    updates.expenseDate = parsedDate.toISOString().split('T')[0];
                                }
                            } catch (err) {
                                console.error('Date parsing error:', err);
                            }
                        }
                        if (result.data.merchant) {
                            updates.description = result.data.merchant;
                        }
                        if (result.data.category) {
                            updates.category = result.data.category;
                        }

                        setNewExpense((prev) => ({ ...prev, ...updates }));

                        toast.success('Receipt scanned successfully!', {
                            description: 'Review and edit the extracted data if needed',
                        });
                    } else {
                        toast.error('Failed to scan receipt', {
                            description: result.error || 'Please enter details manually',
                        });
                    }
                } catch (error) {
                    console.error('OCR Error:', error);
                    toast.error('Scanning failed', {
                        description: 'Please enter expense details manually',
                    });
                } finally {
                    setIsScanning(false);
                    setScanProgress(0);
                }
            } else {
                toast.success('Receipt uploaded successfully!');
            }
        }
    };

    const handleSubmit = () => {
        if (!newExpense.description || !newExpense.expenseDate || !newExpense.category || !newExpense.totalAmount) {
            toast.error('Please fill all required fields');
            return;
        }

        const createdExpense = {
            id: Date.now(),
            employee: 'Current User',
            description: newExpense.description,
            date: new Date(newExpense.expenseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            category: newExpense.category,
            paidBy: newExpense.paidBy || 'Self',
            remarks: newExpense.remarks,
            amount: `${newExpense.currencySelection} ${newExpense.totalAmount}`,
            status: 'Draft',
            receipt: file?.name,
        };

        onExpenseCreated(createdExpense);
        setIsOpen(false);
        setNewExpense({
            description: '',
            expenseDate: '',
            category: '',
            paidBy: '',
            totalAmount: '',
            currencySelection: 'USD',
            remarks: '',
        });
        setFile(null);
        setScannedData(null);
        setScanProgress(0);
        setIsScanning(false);

        toast.success('Expense created successfully!', {
            description: 'Your expense has been saved as draft.',
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Expense</DialogTitle>
                    <DialogDescription>
                        Upload receipt or add expense details manually
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* File Upload */}
                    <div className="grid gap-2">
                        <Label htmlFor="receipt">Attach Receipt</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="receipt"
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                                disabled={isScanning}
                            />
                            {isScanning ? (
                                <Scan className="h-5 w-5 text-primary animate-pulse" />
                            ) : (
                                <Upload className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>
                        {file && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                                ✓ {file.name}
                            </p>
                        )}
                        
                        {/* OCR Scanning Progress */}
                        {isScanning && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Scanning receipt...</span>
                                    <span className="font-medium">{scanProgress}%</span>
                                </div>
                                <Progress value={scanProgress} className="h-2" />
                            </div>
                        )}

                        {/* Scanned Data Alert */}
                        {scannedData && !isScanning && (
                            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertTitle className="text-green-800 dark:text-green-200">Receipt Scanned Successfully</AlertTitle>
                                <AlertDescription className="text-green-700 dark:text-green-300 text-xs space-y-1 mt-2">
                                    {scannedData.merchant && (
                                        <div><strong>Merchant:</strong> {scannedData.merchant}</div>
                                    )}
                                    {scannedData.amount && (
                                        <div><strong>Amount:</strong> {scannedData.currency} {scannedData.amount}</div>
                                    )}
                                    {scannedData.date && (
                                        <div><strong>Date:</strong> {scannedData.date}</div>
                                    )}
                                    {scannedData.category && (
                                        <div><strong>Category:</strong> {scannedData.category}</div>
                                    )}
                                    <div className="text-xs text-muted-foreground mt-2 italic">
                                        Review and edit the fields below if needed
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Description */}
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter expense description"
                            value={newExpense.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Date and Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="expenseDate">Expense Date *</Label>
                            <Input
                                id="expenseDate"
                                type="date"
                                value={newExpense.expenseDate}
                                onChange={(e) => handleInputChange('expenseDate', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={newExpense.category}
                                onValueChange={(value) => handleInputChange('category', value)}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Amount and Currency */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="totalAmount">Total Amount *</Label>
                            <Input
                                id="totalAmount"
                                type="number"
                                placeholder="0.00"
                                value={newExpense.totalAmount}
                                onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                                value={newExpense.currencySelection}
                                onValueChange={(value) => handleInputChange('currencySelection', value)}
                                disabled={isLoadingCurrencies}
                            >
                                <SelectTrigger id="currency">
                                    {isLoadingCurrencies ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading...
                                        </span>
                                    ) : (
                                        <SelectValue />
                                    )}
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {currencies.map((curr) => (
                                        <SelectItem key={curr.code} value={curr.code}>
                                            {curr.code} - {curr.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Paid By */}
                    <div className="grid gap-2">
                        <Label htmlFor="paidBy">Paid By</Label>
                        <Input
                            id="paidBy"
                            placeholder="Enter payer name (optional)"
                            value={newExpense.paidBy}
                            onChange={(e) => handleInputChange('paidBy', e.target.value)}
                        />
                    </div>

                    {/* Remarks */}
                    <div className="grid gap-2">
                        <Label htmlFor="remarks">Remarks</Label>
                        <Textarea
                            id="remarks"
                            placeholder="Additional notes or comments"
                            value={newExpense.remarks}
                            onChange={(e) => handleInputChange('remarks', e.target.value)}
                            rows={2}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};