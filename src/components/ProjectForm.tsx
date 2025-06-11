import React from 'react';
import { ProjectInfo } from '@/types';
import { useQuoteStore } from '@/store/useQuoteStore';

export const ProjectForm: React.FC = () => {
  const { currentQuote, setProjectInfo } = useQuoteStore();
  const project = currentQuote.project || {
    projectName: '',
    quoteDate: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    projectDuration: '',
    deliveryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  };

  const handleChange = (field: keyof ProjectInfo, value: any) => {
    setProjectInfo({
      ...project,
      [field]: value,
    });
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="card">
      <h2>프로젝트 정보</h2>
      <div className="grid grid-2">
        <div className="form-group">
          <label>프로젝트명</label>
          <input
            type="text"
            className="form-control"
            value={project.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            placeholder="프로젝트명을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label>프로젝트 기간</label>
          <input
            type="text"
            className="form-control"
            value={project.projectDuration}
            onChange={(e) => handleChange('projectDuration', e.target.value)}
            placeholder="예: 2개월"
          />
        </div>
        <div className="form-group">
          <label>견적일</label>
          <input
            type="date"
            className="form-control"
            value={formatDate(project.quoteDate)}
            onChange={(e) => handleChange('quoteDate', new Date(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>유효기간</label>
          <input
            type="date"
            className="form-control"
            value={formatDate(project.validUntil)}
            onChange={(e) => handleChange('validUntil', new Date(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>납품예정일</label>
          <input
            type="date"
            className="form-control"
            value={formatDate(project.deliveryDate)}
            onChange={(e) => handleChange('deliveryDate', new Date(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};