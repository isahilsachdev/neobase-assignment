"use client"

import React, { useState } from "react";
import TransferInputFields from "../components/TransferInputFields";
import TransactionsTable from "../components/TransactionsTable";

interface Transaction {
    id: string;
    amount: string;
    time: string;
}

const Home: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const handleTransaction = (id: string, amount: string) => {
        const newTransaction: Transaction = {
            id,
            amount,
            time: new Date().toLocaleString(),
        };
        setTransactions((prev) => [newTransaction, ...prev]);
    };

    return (
        <div className="relative">
            
            <div className=" flex justify-center">
                <TransferInputFields onTransactionComplete={handleTransaction} />
            </div>
            
            {
                transactions?.length > 0 && (
                    <div className="mt-20 flex items-center justify-center mb-20">
                        <TransactionsTable transactions={transactions} />
                    </div>
                )
            }
        </div>
    );
};

export default Home;
