// Learning and Attendance Types
export type LearningType = 'qaida' | 'nazra' | 'hifz';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

// Base Progress Interface
export interface BaseProgress {
  id: string;
  studentId: string;
  teacherId: string;
  date: Date;
  attendanceStatus: AttendanceStatus;
  teacherRemarks?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Qaida Progress
export interface QaidaProgress extends BaseProgress {
  learningType: 'qaida';
  qaidaLessonNumber: number;
  qaidaPageNumber: number;
  qaidaTopic: string;
  qaidaMistakesCount: number;
}

// Nazra Progress
export interface NazraProgress extends BaseProgress {
  learningType: 'nazra';
  nazraParaNumber: number; // 1-30
  nazraFromAyah: string; // Format: "Surah:Ayah" e.g., "2:255"
  nazraToAyah: string;
  nazraMistakesCount: number;
}

// Hifz Ayat Mistake
export interface HifzAyatMistake {
  ayah: string; // Format: "Surah:Ayah"
  mistakes: number;
}

// Hifz Progress
export interface HifzProgress extends BaseProgress {
  learningType: 'hifz';
  hifzSabaq: string; // New lesson
  hifzSabqi: string; // Recent revision
  hifzManzil: string; // Old revision
  hifzAyatMistakes: HifzAyatMistake[];
}

// Discriminated Union for type-safe progress records
export type DailyProgress = QaidaProgress | NazraProgress | HifzProgress;

// Edit History
export interface ProgressEditHistory {
  id: string;
  progressId: string;
  editedBy: string;
  editedAt: Date;
  previousState: DailyProgress;
  changesSummary?: string;
}

// API Request/Response Types
export interface CreateProgressRequest {
  studentId: string;
  date: string; // ISO date string
  attendanceStatus: AttendanceStatus;
  teacherRemarks?: string;
  learningType: LearningType;
  
  // Qaida fields (optional, required if learningType === 'qaida')
  qaidaLessonNumber?: number;
  qaidaPageNumber?: number;
  qaidaTopic?: string;
  qaidaMistakesCount?: number;
  
  // Nazra fields (optional, required if learningType === 'nazra')
  nazraParaNumber?: number;
  nazraFromAyah?: string;
  nazraToAyah?: string;
  nazraMistakesCount?: number;
  
  // Hifz fields (optional, required if learningType === 'hifz')
  hifzSabaq?: string;
  hifzSabqi?: string;
  hifzManzil?: string;
  hifzAyatMistakes?: HifzAyatMistake[];
}

export type UpdateProgressRequest = Partial<CreateProgressRequest>;

export interface ProgressListQuery {
  studentId?: string;
  teacherId?: string;
  dateFrom?: string;
  dateTo?: string;
  learningType?: LearningType;
  page?: number;
  limit?: number;
}

export interface ProgressListResponse {
  data: DailyProgress[];
  total: number;
  page: number;
  limit: number;
}
