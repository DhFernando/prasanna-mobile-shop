/**
 * ThemeSwitcher Component
 * For users: Only dark/light mode toggle
 * For admins: Dark/light mode + color theme selection (saves to server)
 */

'use client';

import React, { useState } from 'react';
import { useTheme, colorThemes, ColorTheme, Mode } from '@/lib/theme';
import { Icon } from '@/components/atoms';

interface ThemeSwitcherProps {
  isAdmin?: boolean; // If true, shows color theme options
  compact?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  isAdmin = false,
  compact = false 
}) => {
  const { mode, setMode, colorTheme, setColorTheme, isDark, isLoading } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const modeOptions: { value: Mode; label: string; icon: 'sun' | 'moon' | 'settings' }[] = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'system', label: 'Auto', icon: 'settings' },
  ];

  const handleColorThemeChange = async (theme: ColorTheme) => {
    if (!isAdmin) return;
    setIsSaving(true);
    await setColorTheme(theme);
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-stone-800' : 'bg-stone-100'} animate-pulse`} />
    );
  }

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-10 h-10 rounded-xl
            flex items-center justify-center
            transition-all duration-200
            ${isDark 
              ? 'bg-stone-800 hover:bg-stone-700 text-yellow-400' 
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
            }
          `}
          aria-label="Theme settings"
        >
          {isDark ? <Icon name="moon" size={20} /> : <Icon name="sun" size={20} />}
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className={`
              absolute right-0 top-full mt-2
              ${isAdmin ? 'w-72' : 'w-64'} p-4
              rounded-2xl shadow-2xl border
              z-50
              ${isDark 
                ? 'bg-stone-900 border-stone-700' 
                : 'bg-white border-stone-200'
              }
            `}>
              {/* Mode Selection */}
              <div className={isAdmin ? 'mb-4' : ''}>
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  Appearance
                </p>
                <div className={`flex gap-1 p-1 rounded-xl ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}>
                  {modeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMode(option.value)}
                      className={`
                        flex-1 flex items-center justify-center gap-1
                        py-2 px-2 rounded-lg
                        text-xs font-medium
                        transition-all duration-200
                        ${mode === option.value
                          ? isDark
                            ? 'bg-stone-700 text-white shadow-sm'
                            : 'bg-white text-stone-900 shadow-sm'
                          : isDark
                            ? 'text-stone-400 hover:text-stone-300'
                            : 'text-stone-500 hover:text-stone-700'
                        }
                      `}
                    >
                      <Icon name={option.icon} size={14} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme Selection - Admin Only */}
              {isAdmin && (
                <div>
                  <p className={`text-xs font-medium mb-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    Site Color Theme
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.entries(colorThemes) as [ColorTheme, typeof colorThemes[ColorTheme]][]).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => handleColorThemeChange(key)}
                        disabled={isSaving}
                        className={`
                          relative group
                          w-full aspect-square rounded-xl
                          flex items-center justify-center
                          transition-all duration-200
                          disabled:opacity-50
                          ${colorTheme === key
                            ? 'ring-2 ring-offset-2 scale-110'
                            : 'hover:scale-105'
                          }
                          ${isDark ? 'ring-offset-stone-900' : 'ring-offset-white'}
                        `}
                        style={{ 
                          backgroundColor: theme.primaryHex,
                          '--tw-ring-color': theme.primaryHex,
                        } as React.CSSProperties}
                        title={theme.name}
                      >
                        {colorTheme === key && (
                          <Icon name="check" size={14} className="text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                  {isSaving && (
                    <p className={`text-xs mt-2 text-center ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      Saving...
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Full panel version (for settings page)
  return (
    <div className={`
      p-6 rounded-2xl border
      ${isDark ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}
    `}>
      <h3 className={`font-display font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-stone-900'}`}>
        {isAdmin ? 'Theme Settings' : 'Appearance'}
      </h3>
      
      {/* Mode Selection */}
      <div className={isAdmin ? 'mb-6' : ''}>
        <p className={`text-sm font-medium mb-3 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
          Dark / Light Mode
        </p>
        <div className="flex gap-2">
          {modeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setMode(option.value)}
              className={`
                flex-1 flex flex-col items-center gap-2
                py-4 px-3 rounded-xl
                border-2 transition-all duration-200
                ${mode === option.value
                  ? 'border-current'
                  : isDark
                    ? 'border-stone-700 hover:border-stone-600'
                    : 'border-stone-200 hover:border-stone-300'
                }
              `}
              style={mode === option.value ? { 
                borderColor: colorThemes[colorTheme].primaryHex, 
                color: colorThemes[colorTheme].primaryHex 
              } : {}}
            >
              <Icon name={option.icon} size={24} />
              <span className={`text-sm font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Theme Selection - Admin Only */}
      {isAdmin && (
        <div>
          <p className={`text-sm font-medium mb-3 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            Site Color Theme (applies to all users)
          </p>
          <div className="grid grid-cols-4 gap-3">
            {(Object.entries(colorThemes) as [ColorTheme, typeof colorThemes[ColorTheme]][]).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleColorThemeChange(key)}
                disabled={isSaving}
                className={`
                  relative group
                  flex flex-col items-center gap-2
                  p-3 rounded-xl
                  border-2 transition-all duration-200
                  disabled:opacity-50
                  ${colorTheme === key
                    ? 'border-current'
                    : isDark
                      ? 'border-stone-700 hover:border-stone-600'
                      : 'border-stone-200 hover:border-stone-300'
                  }
                `}
                style={colorTheme === key ? { borderColor: theme.primaryHex } : {}}
              >
                <div 
                  className="w-8 h-8 rounded-full shadow-lg"
                  style={{ backgroundColor: theme.primaryHex }}
                />
                <span className={`text-xs font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {theme.name}
                </span>
                {colorTheme === key && (
                  <div 
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.primaryHex }}
                  >
                    <Icon name="check" size={10} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          {isSaving && (
            <p className={`text-sm mt-3 text-center ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              Saving theme...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
