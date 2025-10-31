import React, { Children, isValidElement } from 'react';

interface TabsProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ children, activeTab, onTabChange }) => {
    const tabs = Children.toArray(children).filter(isValidElement);
    const activeChild = tabs.find(child => child.props['data-id'] === activeTab);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 border-b border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {tabs.map(tab => {
                        const tabId = tab.props['data-id'];
                        const title = tab.props['data-title'];
                        const isActive = activeTab === tabId;

                        return (
                            <button
                                key={tabId}
                                onClick={() => onTabChange(tabId)}
                                className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-base transition-colors
                                    ${isActive
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                                    }`
                                }
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {title}
                            </button>
                        );
                    })}
                </nav>
            </div>
            <div className="flex-grow min-h-0">
                {activeChild}
            </div>
        </div>
    );
};
