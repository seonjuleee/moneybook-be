import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense, ExpenseCategory } from './expense.entity';

export interface ParsedExpense {
  amount: number;
  item: string;
  date: Date;
  category: ExpenseCategory;
}

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  // 자연어 텍스트에서 지출 정보 추출
  async parseExpenseText(text: string): Promise<ParsedExpense> {
    // 현재는 간단한 정규식 기반 파싱
    // TODO: AI 기반 파싱으로 개선 예정

    // 여기에 실제 비동기 로직을 넣어야 함
    // 예: AI API 호출

    // 예시: 비동기 처리 흉내
    await new Promise((resolve) => setTimeout(resolve, 10)); // 10ms delay

    const amountMatch = text.match(/(\d{1,3}(?:,\d{3})*|\d+)원/);
    const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0;

    // 날짜 추출 (간단한 패턴)
    let date = new Date();
    const dateMatch = text.match(/(\d{1,2})월\s*(\d{1,2})일/);
    if (dateMatch) {
      const month = parseInt(dateMatch[1]) - 1; // 0-based month
      const day = parseInt(dateMatch[2]);
      date = new Date(new Date().getFullYear(), month, day);
    }

    // 항목명 추출 (금액 앞의 텍스트에서 추출)
    let item = '기타';
    if (amountMatch) {
      const beforeAmount = text.substring(0, text.indexOf(amountMatch[0]));
      const words = beforeAmount.split(/\s+/).filter((word) => word.length > 0);
      if (words.length > 0) {
        item = words[words.length - 1]; // 마지막 단어를 항목명으로 사용
      }
    }

    // 카테고리 자동 분류
    const category = this.categorizeExpense(item, text);

    return {
      amount,
      item,
      date,
      category,
    };
  }

  // 카테고리 자동 분류
  private categorizeExpense(item: string, text: string): ExpenseCategory {
    const lowerText = text.toLowerCase();
    // const lowerItem = item.toLowerCase();

    // 식비 관련
    if (
      lowerText.includes('스타벅스') ||
      lowerText.includes('카페') ||
      lowerText.includes('음식') ||
      lowerText.includes('식당') ||
      lowerText.includes('배달') ||
      lowerText.includes('점심') ||
      lowerText.includes('저녁') ||
      lowerText.includes('아침')
    ) {
      return ExpenseCategory.FOOD;
    }

    // 교통비 관련
    if (
      lowerText.includes('버스') ||
      lowerText.includes('지하철') ||
      lowerText.includes('택시') ||
      lowerText.includes('기차') ||
      lowerText.includes('주차') ||
      lowerText.includes('주유')
    ) {
      return ExpenseCategory.TRANSPORT;
    }

    // 쇼핑 관련
    if (
      lowerText.includes('마트') ||
      lowerText.includes('편의점') ||
      lowerText.includes('백화점') ||
      lowerText.includes('쇼핑') ||
      lowerText.includes('옷') ||
      lowerText.includes('신발')
    ) {
      return ExpenseCategory.SHOPPING;
    }

    // 문화생활
    if (
      lowerText.includes('영화') ||
      lowerText.includes('공연') ||
      lowerText.includes('게임') ||
      lowerText.includes('놀이공원')
    ) {
      return ExpenseCategory.ENTERTAINMENT;
    }

    // 의료비
    if (
      lowerText.includes('병원') ||
      lowerText.includes('약') ||
      lowerText.includes('치과') ||
      lowerText.includes('의료')
    ) {
      return ExpenseCategory.MEDICAL;
    }

    // 교육비
    if (
      lowerText.includes('학원') ||
      lowerText.includes('책') ||
      lowerText.includes('교육') ||
      lowerText.includes('강의')
    ) {
      return ExpenseCategory.EDUCATION;
    }

    // 공과금
    if (
      lowerText.includes('전기') ||
      lowerText.includes('수도') ||
      lowerText.includes('가스') ||
      lowerText.includes('인터넷') ||
      lowerText.includes('통신')
    ) {
      return ExpenseCategory.UTILITY;
    }

    return ExpenseCategory.OTHER;
  }

  // 지출 내역 저장
  async createExpense(text: string): Promise<Expense> {
    const parsed = await this.parseExpenseText(text);

    const expense = this.expenseRepository.create({
      description: text,
      amount: parsed.amount,
      item: parsed.item,
      date: parsed.date,
      category: parsed.category,
    });

    return this.expenseRepository.save(expense);
  }

  // 지출 내역 조회 (최신순)
  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // 월별 지출 통계
  async getMonthlyStats(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // SQLite에서는 Between을 사용
    const expenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.date BETWEEN :startDate AND :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })
      .getMany();

    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const categoryStats = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalAmount,
      categoryStats,
      expenseCount: expenses.length,
      year,
      month,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }

  // 전체 통계 (모든 데이터)
  async getAllStats() {
    const expenses = await this.expenseRepository.find();

    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const categoryStats = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalAmount,
      categoryStats,
      expenseCount: expenses.length,
      totalExpenses: expenses,
    };
  }
}
