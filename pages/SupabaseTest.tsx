/**
 * Supabase Connection Test Page
 * 
 * Temporary page to verify database connection is working
 * Access at: /supabase-test
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui';
import { CheckCircle, XCircle, Loader2, Database, Users, Gift, Tag, Trophy } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
  count?: number;
}

export const SupabaseTest = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Connection', status: 'pending' },
    { name: 'Competitions', status: 'pending' },
    { name: 'Instant Win Prizes', status: 'pending' },
    { name: 'Promo Codes', status: 'pending' },
    { name: 'Winners', status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const newTests = [...tests];

    // Test 1: Basic Connection
    try {
      const { data, error } = await supabase.from('competitions').select('count');
      if (error) throw error;
      newTests[0] = { name: 'Connection', status: 'success', data: 'Connected to Supabase' };
    } catch (err: any) {
      newTests[0] = { name: 'Connection', status: 'error', error: err.message };
    }
    setTests([...newTests]);

    // Test 2: Fetch Competitions
    try {
      const { data, error, count } = await supabase
        .from('competitions')
        .select('id, title, status, category', { count: 'exact' });
      if (error) throw error;
      newTests[1] = { 
        name: 'Competitions', 
        status: 'success', 
        data: data,
        count: count || data?.length || 0
      };
    } catch (err: any) {
      newTests[1] = { name: 'Competitions', status: 'error', error: err.message };
    }
    setTests([...newTests]);

    // Test 3: Fetch Instant Win Prizes
    try {
      const { data, error, count } = await supabase
        .from('instant_win_prizes')
        .select('id, name, type, value_gbp, remaining_quantity', { count: 'exact' });
      if (error) throw error;
      newTests[2] = { 
        name: 'Instant Win Prizes', 
        status: 'success', 
        data: data,
        count: count || data?.length || 0
      };
    } catch (err: any) {
      newTests[2] = { name: 'Instant Win Prizes', status: 'error', error: err.message };
    }
    setTests([...newTests]);

    // Test 4: Fetch Promo Codes
    try {
      const { data, error, count } = await supabase
        .from('promo_codes')
        .select('id, code, type, value, is_active', { count: 'exact' });
      if (error) throw error;
      newTests[3] = { 
        name: 'Promo Codes', 
        status: 'success', 
        data: data,
        count: count || data?.length || 0
      };
    } catch (err: any) {
      newTests[3] = { name: 'Promo Codes', status: 'error', error: err.message };
    }
    setTests([...newTests]);

    // Test 5: Fetch Winners
    try {
      const { data, error, count } = await supabase
        .from('winners')
        .select('id, display_name, prize_name, location', { count: 'exact' });
      if (error) throw error;
      newTests[4] = { 
        name: 'Winners', 
        status: 'success', 
        data: data,
        count: count || data?.length || 0
      };
    } catch (err: any) {
      newTests[4] = { name: 'Winners', status: 'error', error: err.message };
    }
    setTests([...newTests]);

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Connection': return <Database size={20} />;
      case 'Competitions': return <Gift size={20} />;
      case 'Instant Win Prizes': return <Trophy size={20} />;
      case 'Promo Codes': return <Tag size={20} />;
      case 'Winners': return <Users size={20} />;
      default: return <Database size={20} />;
    }
  };

  const allPassed = tests.every(t => t.status === 'success');
  const anyFailed = tests.some(t => t.status === 'error');

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-cream-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-teal-900">Supabase Connection Test</h1>
              <p className="text-stone-500 mt-1">Verifying database connection and data</p>
            </div>
            <Button onClick={runTests} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Run Tests Again'
              )}
            </Button>
          </div>

          {/* Status Summary */}
          {!isRunning && (
            <div className={`p-4 rounded-xl mb-8 ${
              allPassed ? 'bg-green-50 border border-green-200' : 
              anyFailed ? 'bg-red-50 border border-red-200' : 
              'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center gap-3">
                {allPassed ? (
                  <>
                    <CheckCircle size={24} className="text-green-600" />
                    <div>
                      <p className="font-bold text-green-800">All Tests Passed!</p>
                      <p className="text-sm text-green-600">Supabase is connected and working correctly.</p>
                    </div>
                  </>
                ) : anyFailed ? (
                  <>
                    <XCircle size={24} className="text-red-600" />
                    <div>
                      <p className="font-bold text-red-800">Some Tests Failed</p>
                      <p className="text-sm text-red-600">Check the errors below and verify your database setup.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Loader2 size={24} className="text-yellow-600 animate-spin" />
                    <div>
                      <p className="font-bold text-yellow-800">Tests Running...</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Test Results */}
          <div className="space-y-4">
            {tests.map((test, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border ${
                  test.status === 'success' ? 'bg-green-50 border-green-200' :
                  test.status === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-cream-50 border-cream-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      test.status === 'success' ? 'bg-green-100 text-green-600' :
                      test.status === 'error' ? 'bg-red-100 text-red-600' :
                      'bg-cream-100 text-stone-400'
                    }`}>
                      {getIcon(test.name)}
                    </div>
                    <div>
                      <p className="font-bold text-teal-900">{test.name}</p>
                      {test.count !== undefined && (
                        <p className="text-sm text-stone-500">{test.count} records found</p>
                      )}
                    </div>
                  </div>
                  <div>
                    {test.status === 'pending' && <Loader2 size={20} className="text-stone-400 animate-spin" />}
                    {test.status === 'success' && <CheckCircle size={20} className="text-green-600" />}
                    {test.status === 'error' && <XCircle size={20} className="text-red-600" />}
                  </div>
                </div>

                {test.error && (
                  <div className="mt-3 p-3 bg-red-100 rounded-lg">
                    <p className="text-sm text-red-700 font-mono">{test.error}</p>
                  </div>
                )}

                {test.status === 'success' && test.data && Array.isArray(test.data) && test.data.length > 0 && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-green-100 max-h-40 overflow-y-auto">
                    <pre className="text-xs text-stone-600 font-mono whitespace-pre-wrap">
                      {JSON.stringify(test.data.slice(0, 3), null, 2)}
                      {test.data.length > 3 && `\n... and ${test.data.length - 3} more`}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Configuration Info */}
          <div className="mt-8 p-4 bg-cream-50 rounded-xl border border-cream-200">
            <p className="text-sm text-stone-600">
              <strong className="text-teal-900">Supabase URL:</strong>{' '}
              <code className="bg-cream-100 px-2 py-0.5 rounded text-xs">
                https://kssmvglunanbanjvmeqe.supabase.co
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
