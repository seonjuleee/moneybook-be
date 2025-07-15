import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum ExpenseCategory {
  FOOD = '식비',
  TRANSPORT = '교통비',
  SHOPPING = '쇼핑',
  ENTERTAINMENT = '문화생활',
  MEDICAL = '의료비',
  EDUCATION = '교육비',
  UTILITY = '공과금',
  OTHER = '기타',
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string; // 원본 텍스트

  @Column()
  amount: number; // 금액

  @Column()
  item: string; // 항목명

  @Column({ type: 'date' })
  date: Date; // 날짜

  @Column({
    type: 'varchar',
    default: ExpenseCategory.OTHER,
  })
  category: ExpenseCategory; // 카테고리

  @CreateDateColumn()
  createdAt: Date; // 생성일시
}
