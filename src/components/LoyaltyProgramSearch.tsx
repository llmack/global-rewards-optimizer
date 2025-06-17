import React, { useState, useEffect } from 'react';
import { LoyaltyProgram } from '../types';
import { Search, Plus, Heart, Info, X, Plane } from 'lucide-react';
import { availableLoyaltyPrograms } from '../data/loyaltyPrograms';
import { saveUserData, getUserData, trackEngagement } from '../utils/storage';

interface LoyaltyProgramSearchProps {
  onAddProgram: (program: LoyaltyProgram) => void;
}

const LoyaltyProgramSearch: React.FC<LoyaltyProgramSearchProps> = ({ onAddProgram }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<LoyaltyProgram | null>(null);
  const [savedPrograms, setSavedPrograms] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userData = getUserData();
    setSavedPrograms(userData.savedPrograms);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showModal]);

  const filteredPrograms = availableLoyaltyPrograms.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.alliance.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.partners.some(partner => 
      partner.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSaveProgram = (programId: string) => {
    trackEngagement({
      type: 'save',
      element: 'loyalty_program',
      metadata: { programId }
    });

    const newSavedPrograms = savedPrograms.includes(programId)
      ? savedPrograms.filter(id => id !== programId)
      : [...savedPrograms, programId];
    
    setSavedPrograms(newSavedPrograms);
    saveUserData({ savedPrograms: newSavedPrograms });
  };

  const handleProgramClick = (program: LoyaltyProgram) => {
    trackEngagement({
      type: 'click',
      element: 'loyalty_program_details',
      metadata: { programId: program.id, programName: program.name }
    });
    
    setSelectedProgram(program);
    setShowModal(true);
  };

  const handleAddProgram = (program: LoyaltyProgram) => {
    trackEngagement({
      type: 'click',
      element: 'add_loyalty_program',
      metadata: { programId: program.id, programName: program.name }
    });
    
    onAddProgram(program);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Plane className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Airline Loyalty Programs</h2>
          <p className="text-gray-600">Add your existing airline miles and loyalty accounts</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by airline, program name, or alliance..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              trackEngagement({
                type: 'search',
                element: 'loyalty_program_search',
                metadata: { query: e.target.value }
              });
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredPrograms.map((program) => (
          <div
            key={program.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{program.name}</h3>
                <p className="text-sm text-gray-600">{program.airline}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveProgram(program.id);
                  }}
                  className={`p-1 rounded-full transition-colors ${
                    savedPrograms.includes(program.id)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${savedPrograms.includes(program.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleProgramClick(program)}
                  className="p-1 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAllianceColor(program.alliance)}`}>
                  {program.alliance}
                </span>
              </div>

              {program.partners.length > 0 && (
                <div className="text-xs text-gray-500">
                  Partners: {program.partners.slice(0, 2).join(', ')}
                  {program.partners.length > 2 && ` +${program.partners.length - 2} more`}
                </div>
              )}
            </div>

            <button
              onClick={() => handleAddProgram(program)}
              className="w-full mt-3 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add to Portfolio</span>
            </button>
          </div>
        ))}
      </div>

      {/* Program Details Modal */}
      {showModal && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.name}</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close (ESC)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className={`bg-gradient-to-r ${selectedProgram.color} p-6 rounded-lg text-white mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedProgram.name}</h3>
                    <p className="opacity-90">{selectedProgram.airline}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">Alliance</div>
                    <div className="text-lg font-bold">{selectedProgram.alliance}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedProgram.description}</p>
                </div>

                {selectedProgram.partners.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Alliance & Partners</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProgram.partners.map((partner, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => handleAddProgram(selectedProgram)}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add to Portfolio</span>
                  </button>
                  <button
                    onClick={() => handleSaveProgram(selectedProgram.id)}
                    className={`px-6 py-3 rounded-lg border transition-colors flex items-center space-x-2 ${
                      savedPrograms.includes(selectedProgram.id)
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${savedPrograms.includes(selectedProgram.id) ? 'fill-current' : ''}`} />
                    <span>{savedPrograms.includes(selectedProgram.id) ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyProgramSearch;