import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import GraphFilter from './GraphFilter.svelte';

/**
 * @vitest-environment jsdom
 */

describe('GraphFilter', () => {
    it('displays selected rivers or stations', async () => {
      const selectedRivers = new Map([
        ['1', { name: 'River1', startDate: '2022-01-01' }],
        ['2', { name: 'River2', startDate: '2022-02-01' }]
      ]);
      const selectedStations = new Map([
        ['1', { name: 'Station1', date: '2022-01-01' }],
        ['2', { name: 'Station2', date: '2022-02-01' }]
      ]);
  
      // Render with dataType 'river'
      let { getByText, queryByText, rerender } = render(GraphFilter, { 
        props: { 
          dataType: 'river',
          selectedRivers,
          selectedStations
        } 
      });
  
      expect(getByText('River1 2022-01-01')).toBeTruthy();
      expect(queryByText('Station1 2022-01-01')).toBeNull();
      //
  
      // Re-render with dataType 'station'
      rerender({ 
        props: { 
          dataType: 'station',
          selectedRivers,
          selectedStations
        } 
      });
  
      expect(getByText('Station2 2022-02-01')).toBeTruthy();
      expect(queryByText('River2 2022-02-01')).toBeNull();
    });
  });