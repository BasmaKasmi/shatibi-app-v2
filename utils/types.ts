export interface EvidenceData {
  studentName: string;
  date: string;
  evidence: string;
}

export interface EvidenceModalProps {
  opened: boolean;
  onClose: () => void;
  data: EvidenceData | null;
}
