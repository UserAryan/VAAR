import { CreditCard } from 'lucide-react';
import { Agent, Task } from '../base/Agent';

interface PaymentDetails {
  amount: number;
  milestones: {
    description: string;
    amount: number;
    status: 'completed' | 'pending';
  }[];
}

interface Invoice {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
}

interface PaymentResult {
  id: string;
  status: 'succeeded' | 'failed';
  amount: number;
  processedAt: string;
}

export class PaymentAgent extends Agent {
  constructor() {
    super(
      'Smart Payment Agent',
      'payment_processing',
      ['PROCESS_PAYMENT', 'GENERATE_INVOICE', 'TRACK_MILESTONES'],
      CreditCard
    );
  }

  async executeTask(task: Task) {
    const { paymentDetails } = task.payload as { paymentDetails: PaymentDetails };
    
    // Generate invoice
    const invoice = await this.generateInvoice(paymentDetails);
    
    // Process payment
    const paymentResult = await this.processPayment(paymentDetails);
    
    return {
      invoiceId: invoice.id,
      paymentId: paymentResult.id,
      amount: paymentDetails.amount,
      status: paymentResult.status,
      milestones: paymentDetails.milestones,
      nextPayment: paymentDetails.milestones?.find(m => m.status === 'pending'),
      message: `Payment of $${paymentDetails.amount} processed successfully`
    };
  }

  private async generateInvoice(paymentDetails: PaymentDetails): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: `inv_${Date.now()}`,
      amount: paymentDetails.amount,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'generated'
    };
  }

  private async processPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    // Simulate Stripe API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: `pay_${Date.now()}`,
      status: Math.random() > 0.05 ? 'succeeded' : 'failed',
      amount: paymentDetails.amount,
      processedAt: new Date().toISOString()
    };
  }
} 