import { createClient } from "@/lib/supabase/server";
import type { Seat } from "@/types/database";

export async function getSeatsByHallId(hallId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seats")
    .select("*")
    .eq("hall_id", hallId)
    .order("row_number")
    .order("col_number");

  if (error) throw error;
  return data as Seat[];
}

export async function createSeats(seats: Array<{
  hall_id: string;
  seat_number: string;
  row_number: number;
  col_number: number;
  is_usable?: boolean;
}>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seats")
    .insert(seats)
    .select();

  if (error) throw error;
  return data as Seat[];
}

export async function updateSeat(
  id: string,
  updates: Partial<{
    seat_number: string;
    row_number: number;
    col_number: number;
    is_usable: boolean;
  }>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seats")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Seat;
}

export async function bulkUpdateSeats(
  updates: Array<{ id: string; is_usable: boolean }>
) {
  const supabase = await createClient();

  // Update each seat individually (Supabase doesn't support bulk updates directly)
  const promises = updates.map((update) =>
    supabase
      .from("seats")
      .update({ is_usable: update.is_usable })
      .eq("id", update.id)
  );

  const results = await Promise.all(promises);

  // Check for errors
  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    throw errors[0].error;
  }

  return { success: true, updated: updates.length };
}

export async function deleteSeatsByHallId(hallId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("seats")
    .delete()
    .eq("hall_id", hallId);

  if (error) throw error;
  return { success: true };
}

// Helper function to generate seats for a hall
export function generateSeats(
  hallId: string,
  rows: number,
  columns: number,
  seatsPerDesk: number = 2
): Array<{
  hall_id: string;
  seat_number: string;
  row_number: number;
  col_number: number;
  is_usable: boolean;
}> {
  const seats = [];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let row = 1; row <= rows; row++) {
    for (let col = 0; col < columns * seatsPerDesk; col++) {
      const seatNumber = `${row}${letters[col]}`;
      seats.push({
        hall_id: hallId,
        seat_number: seatNumber,
        row_number: row,
        col_number: col + 1,
        is_usable: true,
      });
    }
  }

  return seats;
}
