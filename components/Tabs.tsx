
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
        <div className="flex flex-col h-full bg-[#2d3748] border border-slate-600 rounded-md">
            <div className="flex-shrink-0 border-b border-slate-600 bg-slate-700/50 rounded-t-md">
                <nav className="-mb-px flex space-x-2 px-2" aria-label="Tabs">
                    {tabs.map(tab => {
                        const tabId = tab.props['data-id'];
                        const title = tab.props['data-title'];
                        const isActive = activeTab === tabId;

                        return (
                            <button
                                key={tabId}
                                onClick={() => onTabChange(tabId)}
                                className={`whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition-colors rounded-t-md
                                    ${isActive
                                        ? 'border-blue-500 text-white'
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
