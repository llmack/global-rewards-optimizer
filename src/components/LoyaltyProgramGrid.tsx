import React, { useState, useEffect } from 'react';
import { LoyaltyProgram } from '../types';
import { Plane, TrendingUp, Edit3, Save, X, Trash2, Users } from 'lucide-react';
import { saveUserData, getUserData, trackEngagement } from '../utils/storage';

interface LoyaltyProgramGridProps {
  programs: LoyaltyProgram[];
  onUpdateProgram: (programId: string, miles: number) => void;
  onRemoveProgram: (programId: string) => void;
}

const LoyaltyProgramGrid: React.FC<LoyaltyProgramGridProps> = ({ 
  programs, 
  onUpdateProgram, 
  onRemoveProgram 
}) => {
  const [editingProgram, setEditingProgram] = useState<string | null>(null);
  const [editMiles, setEditMiles] = useState<string>('');
  const [programMiles, setProgramMiles] = useState<Record<string, number>>({});

  useEffect(() => {
    const userData = getUserData();
    // Defensive check to ensure programMiles exists and is an object
    setProgramMiles(userData.programMiles || {});
  }, []);

  const formatMiles = (miles: number) => {
    return miles.toLocaleString();
  };

  const getAllianceIcon = (alliance: string) => {
    switch (alliance) {
      case 'Star Alliance':
        return '⭐';
      case 'SkyTeam':
        return '🌐';
      case 'Oneworld':
        return '🌍';
      default:
        return '✈️';
    }
  };

  const getAllianceColor = (alliance: string) => {
    switch (alliance) {
      case 'Star Alliance':
        return 'bg-yellow-100 text-yellow-800';
      case 'SkyTeam':
        return 'bg-blue-100 text-blue-800';
      case 'Oneworld':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditMiles = (programId: string, currentMiles: number) => {
    trackEngagement({
      type: 'click',
      element: 'edit_program_miles',
      metadata: { programId }
    });
    
    setEditingProgram(programId);
    setEditMiles(currentMiles.toString());
  };

  const handleSaveMiles = (programId: string) => {
    const miles = parseInt(editMiles) || 0;
    
    trackEngagement({
      type: 'click',
      element: 'save_program_miles',
      metadata: { programId, miles }
    });
    
    const newProgramMiles = { ...programMiles, [programId]: miles };
    setProgramMiles(newProgramMiles);
    saveUserData({ programMiles: newProgramMiles });
    onUpdateProgram(programId, miles);
    setEditingProgram(null);
  };

  const handleCancelEdit = () => {
    setEditingProgram(null);
    setEditMiles('');
  };

  const handleRemoveProgram = (programId: string) => {
    trackEngagement({
      type: 'click',
      element: 'remove_program',
      metadata: { programId }
    });
    
    // Remove from local storage as well
    const newProgramMiles = { ...programMiles };
    delete newProgramMiles[programId];
    setProgramMiles(newProgramMiles);
    saveUserData({ programMiles: newProgramMiles });
    
    onRemoveProgram(programId);
  };

  const getDisplayMiles = (program: LoyaltyProgram) => {
    // Defensive check to ensure programMiles exists and is an object
    if (!programMiles || typeof programMiles !== 'object') {
      return program.currentMiles || 0;
    }
    return programMiles[program.id] !== undefined ? programMiles[program.id] : (program.currentMiles || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => {
        const displayMiles = getDisplayMiles(program);
        const isEditing = editingProgram === program.id;
        
        return (
          <div
            key={program.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`bg-gradient-to-r ${program.color} p-6 text-white relative`}>
              <button
                onClick={() => handleRemoveProgram(program.id)}
                className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                title="Remove program from portfolio"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getAllianceIcon(program.alliance)}</span>
                  <div>
                    <h3 className="font-bold text-lg">{program.name}</h3>
                    <p className="text-sm opacity-90">{program.airline}</p>
                  </div>
                </div>
                <Plane className="h-6 w-6 opacity-80" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Current Miles</span>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editMiles}
                          onChange={(e) => setEditMiles(e.target.value)}
                          className="w-24 px-2 py-1 text-black rounded text-sm"
                          placeholder="0"
                        />
                        <button
                          onClick={() => handleSaveMiles(program.id)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-xl">{formatMiles(displayMiles)}</span>
                        <button
                          onClick={() => handleEditMiles(program.id, displayMiles)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Alliance</span>
                  <span className="font-semibold">{program.alliance}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAllianceColor(program.alliance)}`}>
                    {program.alliance}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-blue-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {program.partners?.length || 0} alliance partners
                  </span>
                </div>
                
                <div className="pt-2">
                  <div className="text-xs text-gray-500 mb-1">Key Partners</div>
                  <div className="flex flex-wrap gap-1">
                    {(program.partners || []).slice(0, 3).map((partner, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {partner}
                      </span>
                    ))}
                    {(program.partners?.length || 0) > 3 && (
                      <span className="text-xs text-gray-400">
                        +{(program.partners?.length || 0) - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LoyaltyProgramGrid;