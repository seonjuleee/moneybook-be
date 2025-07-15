import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.entity';

export class CreateExpenseDto {
  text: string;
}

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  // 지출 내역 입력
  @Post()
  async createExpense(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expenseService.createExpense(createExpenseDto.text);
  }

  // 지출 내역 조회
  @Get()
  async findAll(): Promise<Expense[]> {
    return this.expenseService.findAll();
  }

  // 월별 통계 조회
  @Get('stats')
  async getMonthlyStats(
    @Query('year') year: string = new Date().getFullYear().toString(),
    @Query('month') month: string = (new Date().getMonth() + 1).toString(),
  ) {
    return this.expenseService.getMonthlyStats(parseInt(year), parseInt(month));
  }

  // 전체 통계 조회
  @Get('stats/all')
  async getAllStats() {
    return this.expenseService.getAllStats();
  }
} 