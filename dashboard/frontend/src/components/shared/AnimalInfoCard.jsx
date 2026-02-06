/**
 * AnimalInfoCard - Reusable animal information card
 * Used for educational content in public view and detection details
 */

import { Clock, MapPin, Camera, AlertTriangle, Info } from 'lucide-react';
import { Card, Badge } from '../ui';
import { formatSmartDate, getRelativeTime, getAnimalIcon, cn } from '../../utils/helpers';

// Animal information database for educational content
const animalInfo = {
  elephant: {
    name: 'Asian Elephant',
    scientificName: 'Elephas maximus',
    diet: 'Herbivore',
    habitat: 'Grasslands, forests, scrublands',
    weight: '4,000 - 5,000 kg',
    lifespan: '60-70 years',
    conservation: 'Endangered',
    behavior: 'Highly social, lives in herds led by matriarchs',
    safetyTip: 'Never approach. Give at least 100m distance. If charging, move away quickly but do not run.',
  },
  tiger: {
    name: 'Bengal Tiger',
    scientificName: 'Panthera tigris tigris',
    diet: 'Carnivore',
    habitat: 'Tropical forests, grasslands',
    weight: '180 - 260 kg',
    lifespan: '10-15 years',
    conservation: 'Endangered',
    behavior: 'Solitary, territorial, primarily nocturnal',
    safetyTip: 'EXTREME DANGER. Do not run. Make yourself appear large. Back away slowly while facing the tiger.',
  },
  lion: {
    name: 'Asiatic Lion',
    scientificName: 'Panthera leo persica',
    diet: 'Carnivore',
    habitat: 'Dry deciduous forest',
    weight: '160 - 190 kg',
    lifespan: '15-18 years',
    conservation: 'Endangered',
    behavior: 'Lives in prides, territorial',
    safetyTip: 'EXTREME DANGER. Stay in vehicle. Do not run or turn your back.',
  },
  leopard: {
    name: 'Indian Leopard',
    scientificName: 'Panthera pardus fusca',
    diet: 'Carnivore',
    habitat: 'Forests, rocky areas',
    weight: '50 - 77 kg',
    lifespan: '12-17 years',
    conservation: 'Vulnerable',
    behavior: 'Solitary, nocturnal, excellent climber',
    safetyTip: 'Stay alert at dawn/dusk. Make noise while walking. Never corner a leopard.',
  },
  bear: {
    name: 'Sloth Bear',
    scientificName: 'Melursus ursinus',
    diet: 'Omnivore (insects, fruits)',
    habitat: 'Forests, scrublands',
    weight: '80 - 140 kg',
    lifespan: '20-40 years',
    conservation: 'Vulnerable',
    behavior: 'Solitary, primarily nocturnal',
    safetyTip: 'Make noise to avoid surprise encounters. If attacked, fight back.',
  },
  bison: {
    name: 'Indian Gaur',
    scientificName: 'Bos gaurus',
    diet: 'Herbivore',
    habitat: 'Evergreen and deciduous forests',
    weight: '700 - 1,000 kg',
    lifespan: '20-25 years',
    conservation: 'Vulnerable',
    behavior: 'Lives in herds, shy but can be aggressive',
    safetyTip: 'Maintain distance. Never block their path or startle them.',
  },
  deer: {
    name: 'Spotted Deer',
    scientificName: 'Axis axis',
    diet: 'Herbivore',
    habitat: 'Grasslands, forests',
    weight: '75 - 100 kg',
    lifespan: '20-30 years',
    conservation: 'Least Concern',
    behavior: 'Lives in herds, alert prey animal',
    safetyTip: 'Generally harmless. Observe from distance.',
  },
  boar: {
    name: 'Wild Boar',
    scientificName: 'Sus scrofa',
    diet: 'Omnivore',
    habitat: 'Forests, grasslands',
    weight: '50 - 100 kg',
    lifespan: '15-20 years',
    conservation: 'Least Concern',
    behavior: 'Lives in sounders, can be aggressive when cornered',
    safetyTip: 'Avoid mothers with piglets. Climb if charged.',
  },
  monkey: {
    name: 'Rhesus Macaque',
    scientificName: 'Macaca mulatta',
    diet: 'Omnivore',
    habitat: 'Various (highly adaptable)',
    weight: '5 - 8 kg',
    lifespan: '25-30 years',
    conservation: 'Least Concern',
    behavior: 'Highly social, lives in troops',
    safetyTip: 'Do not feed or make direct eye contact. Keep food hidden.',
  },
  peacock: {
    name: 'Indian Peafowl',
    scientificName: 'Pavo cristatus',
    diet: 'Omnivore',
    habitat: 'Forests, farmlands',
    weight: '4 - 6 kg',
    lifespan: '15-25 years',
    conservation: 'Least Concern',
    behavior: 'Ground-dwelling, roosts in trees',
    safetyTip: 'Harmless. National bird of India.',
  },
};

// Compact detection card for alerts
function DetectionCard({ detection, onClick, compact = false }) {
  const riskConfig = {
    danger: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    safe: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  };
  
  const risk = riskConfig[detection.riskLevel] || riskConfig.safe;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md',
          risk.bg, risk.border
        )}
      >
        <span className="text-2xl">{getAnimalIcon(detection.animalType)}</span>
        <div className="flex-1 text-left">
          <p className="font-semibold text-gray-900">{detection.animalName}</p>
          <p className="text-xs text-gray-500">{getRelativeTime(detection.timestamp)}</p>
        </div>
        <Badge variant={detection.riskLevel === 'danger' ? 'danger' : detection.riskLevel === 'warning' ? 'warning' : 'success'} size="sm">
          {detection.riskLevel}
        </Badge>
      </button>
    );
  }

  return (
    <Card 
      className={cn('border-l-4 transition-all hover:shadow-lg cursor-pointer', risk.border)}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Animal Icon */}
        <div className={cn('p-4 rounded-xl text-4xl', risk.bg)}>
          {getAnimalIcon(detection.animalType)}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{detection.animalName}</h3>
              <Badge 
                variant={detection.riskLevel === 'danger' ? 'danger' : detection.riskLevel === 'warning' ? 'warning' : 'success'}
                size="sm"
              >
                {detection.riskLevel.toUpperCase()}
              </Badge>
            </div>
            {detection.confidence && (
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {Math.round(detection.confidence * 100)}% confidence
              </span>
            )}
          </div>
          
          {/* Details */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatSmartDate(detection.timestamp)}
            </span>
            {detection.cameraName && (
              <span className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                {detection.cameraName}
              </span>
            )}
            {detection.distance !== undefined && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {detection.distance.toFixed(1)} km away
              </span>
            )}
          </div>
          
          {/* Notes */}
          {detection.notes && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {detection.notes}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

// Educational animal info card for public view
function EducationalCard({ animalType, showFullInfo = false }) {
  const info = animalInfo[animalType];
  
  if (!info) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="p-4 bg-forest-50 rounded-xl text-4xl">
          {getAnimalIcon(animalType)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{info.name}</h3>
          <p className="text-sm text-gray-500 italic">{info.scientificName}</p>
          <Badge 
            variant={info.conservation === 'Endangered' ? 'danger' : info.conservation === 'Vulnerable' ? 'warning' : 'success'}
            size="sm"
            className="mt-1"
          >
            {info.conservation}
          </Badge>
        </div>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase font-medium">Diet</p>
          <p className="font-semibold text-gray-900">{info.diet}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase font-medium">Weight</p>
          <p className="font-semibold text-gray-900">{info.weight}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase font-medium">Habitat</p>
          <p className="font-semibold text-gray-900">{info.habitat}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase font-medium">Lifespan</p>
          <p className="font-semibold text-gray-900">{info.lifespan}</p>
        </div>
      </div>

      {showFullInfo && (
        <>
          {/* Behavior */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Info className="w-4 h-4" />
              Behavior
            </h4>
            <p className="text-sm text-gray-600">{info.behavior}</p>
          </div>

          {/* Safety Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Safety Guidelines
            </h4>
            <p className="text-sm text-amber-700">{info.safetyTip}</p>
          </div>
        </>
      )}
    </Card>
  );
}

// Main export with sub-components
function AnimalInfoCard(props) {
  if (props.educational) {
    return <EducationalCard {...props} />;
  }
  return <DetectionCard {...props} />;
}

AnimalInfoCard.Detection = DetectionCard;
AnimalInfoCard.Educational = EducationalCard;

export default AnimalInfoCard;
export { DetectionCard, EducationalCard, animalInfo };
