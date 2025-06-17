import React, { useState } from 'react';
import { TransferPartner } from '../types';
import { RefreshCw, Gift, Clock, TrendingUp, Info, X } from 'lucide-react';
import { trackEngagement } from '../utils/storage';

interface TransferPartnersProps {
  partners: TransferPartner[];
}

const TransferPartners: React.FC<TransferPartnersProps> = ({ partners }) => {
  const [selectedPartner, setSelectedPartner] = useState<TransferPartner | null>(null);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isPromotionActive = (endDate: string) => {
    return new Date(endDate) > new Date();
  };

  const handlePartnerClick = (partner: TransferPartner) => {
    trackEngagement({
      type: 'click',
      element: 'transfer_partner_details',
      metadata: { partnerId: partner.id, partnerName: partner.name }
    });
    
    setSelectedPartner(partner);
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <RefreshCw className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Transfer Partners</h2>
          <p className="text-gray-600">Maximize value with current promotions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className={`border rounded-lg p-4 transition-all duration-300 hover:shadow-md cursor-pointer ${
              partner.bonusPromo ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{partner.logo}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                  <span className="text-xs text-gray-500 capitalize">{partner.type}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {partner.bonusPromo && (
                  <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    PROMO
                  </div>
                )}
                <button
                  onClick={() => handlePartnerClick(partner)}
                  className="p-1 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base Transfer Rate</span>
                  <span className="font-semibold text-gray-900">{partner.transferRatio}</span>
                </div>
                
                {partner.bonusPromo && (
                  <div className="mt-2 p-3 bg-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Gift className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-semibold text-orange-800">
                        Bonus Rate: {partner.bonusPromo.ratio}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-orange-700">
                      <Clock className="h-3 w-3" />
                      <span>Ends {formatDate(partner.bonusPromo.endDate)}</span>
                      {isPromotionActive(partner.bonusPromo.endDate) && (
                        <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {partner.bonusPromo && (
                <div className="flex items-center space-x-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {partner.bonusPromo.ratio === '1:1.6' ? '60%' : '25%'} bonus value
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Best for:</div>
                <div className="text-xs text-gray-700">
                  {partner.name === 'Singapore Airlines' && 'Premium cabin awards to Asia'}
                  {partner.name === 'Air France' && 'European connections, good availability'}
                  {partner.name === 'British Airways' && 'Short-haul flights, off-peak awards'}
                  {partner.name === 'Turkish Airlines' && 'Wide route network, good value'}
                  {partner.name === 'Delta' && 'Domestic US flights, SkyTeam partners'}
                  {partner.name === 'United Airlines' && 'Star Alliance partners, Excursionist perk'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Transfer Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Transfer bonuses can increase point value by 25-60%</li>
          <li>• Turkish Airlines bonus ends Feb 29 - limited time for 60% boost</li>
          <li>• Singapore Airlines premium cabin awards offer excellent value</li>
          <li>• Always check award availability before transferring points</li>
        </ul>
      </div>

      {/* Partner Details Modal */}
      {showModal && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedPartner.logo}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPartner.name}</h2>
                    <p className="text-gray-600 capitalize">{selectedPartner.type} Partner</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedPartner.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Transfer Rate</h4>
                    <div className="text-2xl font-bold text-blue-600">{selectedPartner.transferRatio}</div>
                    <p className="text-sm text-gray-600">Base transfer ratio</p>
                  </div>

                  {selectedPartner.bonusPromo && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">Bonus Promotion</h4>
                      <div className="text-2xl font-bold text-orange-600">{selectedPartner.bonusPromo.ratio}</div>
                      <p className="text-sm text-orange-700">
                        {selectedPartner.bonusPromo.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-orange-600">
                        <Clock className="h-3 w-3" />
                        <span>Ends {formatDate(selectedPartner.bonusPromo.endDate)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {selectedPartner.bestFor && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Best Used For</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartner.bestFor.map((use, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Transfer Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Transfers are typically instant but can take up to 24 hours</li>
                    <li>• Check award availability before transferring points</li>
                    <li>• Consider transfer bonuses to maximize value</li>
                    <li>• Points transfers are usually irreversible</li>
                  </ul>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => {
                      trackEngagement({
                        type: 'click',
                        element: 'external_link',
                        metadata: { partner: selectedPartner.name, action: 'transfer_points' }
                      });
                      window.open(`https://${selectedPartner.name.toLowerCase().replace(/\s+/g, '')}.com`, '_blank');
                    }}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Transfer Points
                  </button>
                  <button
                    onClick={() => {
                      trackEngagement({
                        type: 'click',
                        element: 'external_link',
                        metadata: { partner: selectedPartner.name, action: 'check_availability' }
                      });
                      window.open(`https://${selectedPartner.name.toLowerCase().replace(/\s+/g, '')}.com/awards`, '_blank');
                    }}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Check Availability
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

export default TransferPartners;