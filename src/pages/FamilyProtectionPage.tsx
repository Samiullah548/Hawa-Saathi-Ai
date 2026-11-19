import React, { useState } from 'react';
import { AirQualityCombinedData } from '../types/airQuality';
import { HouseholdProfileType, ChecklistItem } from '../types/user';
import {
  getFamilyChecklist,
  saveFamilyChecklist,
} from '../services/storage';
import {
  ShieldCheck,
  Baby,
  User,
  Users,
  HardHat,
  AlertCircle,
  CheckCircle2,
  Circle,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';

interface FamilyProtectionPageProps {
  data: AirQualityCombinedData;
}

export const FamilyProtectionPage: React.FC<FamilyProtectionPageProps> = ({ data }) => {
  const [selectedProfile, setSelectedProfile] = useState<HouseholdProfileType>('Child');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => getFamilyChecklist());

  const aqi = data.current.aqi;
  const isHighSmog = aqi > 150;

  const toggleChecklist = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setChecklist(updated);
    saveFamilyChecklist(updated);
  };

  const completedCount = checklist.filter((i) => i.isCompleted).length;
  const completionPercentage = Math.round((completedCount / checklist.length) * 100);

  // Profile-specific guidance generator
  const getProfileSpecificGuidance = () => {
    switch (selectedProfile) {
      case 'Child':
        return {
          icon: Baby,
          vulnerability: 'High Vulnerability: Developing Alveoli & Higher Inhalation Volume',
          description: 'Kids inhale up to 50% more air per pound of body weight than adults, and their respiratory epithelium is more sensitive to ultrafine particulate inflammation.',
          maskAdvice: 'Use pediatric-sized N95 or KF94 respirators with dual adjustable straps. Cloth cartoon masks offer negligible PM2.5 filtration.',
          schoolGuidance: isHighSmog
            ? 'Request school authorities suspend morning outdoor assemblies and sports sessions. Children should play indoors.'
            : 'School sports fine during midday sunny windows.',
          morningRoutine: 'Check AQI before sending child to school. Equip with N95 mask. Pack warm water bottle with honey or ginger.',
          afternoonRoutine: 'Safe window for light outdoor games if AQI < 150. Otherwise organize indoor board games or drawing.',
          eveningRoutine: 'Warm water saline gargle to clear airway dust. Avoid parks near traffic corridors.',
          nightRoutine: 'Turn on bedroom HEPA air purifier on quiet mode 1 hour before bedtime.',
        };
      case 'Elderly Person':
        return {
          icon: Users,
          vulnerability: 'Cardiovascular & Pulmonary Reserve Vulnerability',
          description: 'Winter smog particles trigger systemic inflammation, increasing the incidence of hypertension spikes, angina, and COPD flare-ups.',
          maskAdvice: 'N95 respirator during any necessary outdoor transit. If breathing resistance causes shortness of breath, stay strictly indoors.',
          schoolGuidance: 'Avoid early morning garden walks in cold dew and dense fog (thermal smog inversion).',
          morningRoutine: 'Practice indoor pranayama / gentle stretching in a purified room. Sip warm water.',
          afternoonRoutine: 'Step out for light garden strolls only if sunny and AQI is under 120.',
          eveningRoutine: 'Check blood pressure. Take prescribed respiratory medications or preventive inhalers as advised by physician.',
          nightRoutine: 'Ensure bedroom purifier runs all night. Keep room temperature moderate to prevent bronchial spasms.',
        };
      case 'Sensitive Individual':
        return {
          icon: AlertCircle,
          vulnerability: 'High Risk: Asthma, Bronchitis, Allergies & COPD',
          description: 'Even short-term exposure to PM2.5 and NO2 triggers hyper-reactive bronchial spasms and acute wheezing.',
          maskAdvice: 'Certified N95/FFP2 respirator mandatory outside. Carry rescue bronchodilator inhaler at all times.',
          schoolGuidance: 'Avoid outdoor exercise if AQI exceeds 100. Always exercise in indoor HEPA-purified spaces.',
          morningRoutine: 'Pre-emptive saline nasal spray. Take morning maintenance inhalers promptly.',
          afternoonRoutine: 'Limit transit strictly to necessity. Keep vehicle windows rolled up with AC set to internal recirculation.',
          eveningRoutine: 'Warm steam inhalation with carom seeds (ajwain) or eucalyptus to loosen particulate-induced congestion.',
          nightRoutine: 'Ensure bedroom AQI is below 25. Run HEPA filtration on medium-high speed.',
        };
      case 'Outdoor Worker':
        return {
          icon: HardHat,
          vulnerability: 'Occupational Cumulative Particulate Exposure',
          description: '8+ hours of continuous ambient exposure equals the systemic vascular stress of smoking 15-20 cigarettes per day during peak winter smog.',
          maskAdvice: 'Mandatory industrial-grade N95 or FFP2 respirator. Replace every 8-12 hours when soiled with street soot.',
          schoolGuidance: 'Take 15-minute breaks in enclosed indoor or air-filtered transit rooms whenever possible.',
          morningRoutine: 'Fit check respirator before starting shift. Drink 500ml warm water before leaving home.',
          afternoonRoutine: 'Rest in shade away from vehicular idling spots during lunch break. Rehydrate frequently.',
          eveningRoutine: 'Wash face and eyes with fresh cool water. Saline nasal wash immediately after end of shift.',
          nightRoutine: 'Rest in clean ventilated or filtered room to give pulmonary cilia 8 hours of particulate-free recovery.',
        };
      case 'General Adult':
      default:
        return {
          icon: User,
          vulnerability: 'Standard Adult Baseline (Cumulative Vascular Risk)',
          description: 'While healthy adults may not experience immediate acute shortness of breath, fine PM2.5 causes subtle arterial stiffening and chronic fatigue.',
          maskAdvice: 'N95 mask recommended when AQI exceeds 150, mandatory when above 250.',
          schoolGuidance: 'Shift high-intensity cardio (running/cycling) indoors or reschedule to 1 PM - 4 PM.',
          morningRoutine: 'Indoor bodyweight workouts or yoga. Postpone outdoor running.',
          afternoonRoutine: 'Preferred time for outdoor commute and errands.',
          eveningRoutine: 'Travel with car windows closed. Keep car cabin air filter on recirculation mode.',
          nightRoutine: 'Seal bedroom windows. Run air purifier on sleep mode.',
        };
    }
  };

  const profileInfo = getProfileSpecificGuidance();
  const ProfileIcon = profileInfo.icon;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Tailored Family Defense Protocols</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Family Protection Planner
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Not every family member has the same respiratory resistance. Personalize daily protective routines based on age, health condition, and current air quality in {data.location.name}.
        </p>
      </div>

      {/* Household Profile Selector Tabs */}
      <div className="flex flex-wrap gap-2.5">
        {(
          [
            'Child',
            'Elderly Person',
            'Sensitive Individual',
            'Outdoor Worker',
            'General Adult',
          ] as HouseholdProfileType[]
        ).map((p) => {
          const isSelected = selectedProfile === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedProfile(p)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{p}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Health Guidance Card */}
      <div className="dashboard-card p-6 md:p-8 border-teal-100/80 bg-gradient-to-br from-white via-white to-teal-50/20 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-teal-100 text-teal-800">
              <ProfileIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Target Profile
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {selectedProfile} Protection Strategy
              </h3>
            </div>
          </div>

          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 self-start md:self-auto">
            {profileInfo.vulnerability}
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          {profileInfo.description}
        </p>

        {/* Mask and Commute Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">
              Recommended Mask Protocol:
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {profileInfo.maskAdvice}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">
              School / Work Exposure Guidance:
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {profileInfo.schoolGuidance}
            </p>
          </div>
        </div>

        {/* 4-Phase Time-of-Day Routine for this Profile */}
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 mb-3">
            Recommended Daily Routine for {selectedProfile}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-700">
                <Sun className="w-4 h-4" />
                <span>Morning (6 AM - 10 AM)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {profileInfo.morningRoutine}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
                <Sun className="w-4 h-4" />
                <span>Afternoon (12 PM - 4 PM)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {profileInfo.afternoonRoutine}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-purple-700">
                <Sunset className="w-4 h-4" />
                <span>Evening (5 PM - 8 PM)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {profileInfo.eveningRoutine}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700">
                <Moon className="w-4 h-4" />
                <span>Night (9 PM - 6 AM)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {profileInfo.nightRoutine}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Innovation Feature D: Family Safety Checklist Tracker */}
      <div className="dashboard-card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                Family Safety Checklist
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase font-bold">
                Innovation Tracker
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Track daily habits to safeguard everyone in your household
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700">
              {completedCount} / {checklist.length} Completed
            </span>
            <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleChecklist(item.id);
                }
              }}
              role="checkbox"
              aria-checked={item.isCompleted}
              tabIndex={0}
              aria-label={`${item.title}: ${item.isCompleted ? 'Completed' : 'Not completed'}`}
              className={`p-4 rounded-2xl border cursor-pointer transition flex items-start space-x-3.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                item.isCompleted
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-700'
              }`}
            >
              <span className="mt-0.5 text-emerald-600 flex-shrink-0" aria-hidden="true">
                {item.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </span>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-sm font-bold ${
                      item.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                    {item.frequency}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

