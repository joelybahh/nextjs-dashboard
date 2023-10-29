import { fetchCustomerById, fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import { InvoiceForm } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/invoices/update-form';

import { notFound } from 'next/navigation';

import { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id;

    const invoice = await fetchInvoiceById(id);


    if (!invoice) {
        return notFound();
    }

    const customer = await fetchCustomerById(invoice?.customer_id as string);

    if (!customer) {
        return notFound();
    }

    return {
        title: `Edit ${customer.name}'s Invoice`,
        description: `Edit ${customer.name}'s Invoice for \$${invoice.amount}`,
    };
}


export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    const invoice = await fetchInvoiceById(id);
    const customers = await fetchCustomers();

    if (!invoice) {
        return notFound();
    }
    
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                { label: 'Invoices', href: '/dashboard/invoices' },
                {
                    label: 'Edit Invoice',
                    href: `/dashboard/invoices/${id}/edit`,
                    active: true,
                },
                ]}
            />
            <Form invoice={invoice as InvoiceForm} customers={customers} />
        </main>
    );
}