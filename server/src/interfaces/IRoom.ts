export default interface IRoom {
  id: number,
  title: string,
  start_time: string,  // ex) 201905101440
  end_time: string,
  connected_count: number | null
}